using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OBSTwitch.Notifications;

using TwitchLib.Api;
using TwitchLib.Api.Helix.Models.Clips.GetClips;

using TwitchLib.PubSub;
using TwitchLib.PubSub.Events;

namespace OBSTwitch.Controllers
{
    /// <summary>
    /// <para>
    /// Check the Webhook Guide for information about subscriptions and getting notifications https://dev.twitch.tv/docs/api/webhooks-guide
    /// </para>
    /// <para>
    /// See the subscription guide for implementation information https://dev.twitch.tv/docs/api/webhooks-reference#subscribe-tounsubscribe-from-events
    /// </para>
    /// </summary>
    [ApiController]
    [Route("[controller]/[action]")]
    public class TwitchWebhooksController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly ILogger<TwitchWebhooksController> _logger;

        private static IConfiguration Settings;
        private readonly TwitchAPI twitchAPI;
        private readonly string ChannelId;

        private TwitchPubSub pubSub;

        // channels used for dev purposes due to large transaction rates
        private readonly Dictionary<string, string> _debugChannels = new Dictionary<string, string>()
        {
            { "44424631" , "NickEh30" },
            { "31561517" , "LyonWGFLive" },
            { "133705618" , "Mongraal" },
            { "32787655" , "Kitboga" },
            { "3389768" , "Philza" },
            { "64342766" , "Trymacs" }
        };

        public TwitchWebhooksController(IHubContext<NotificationHub> hubContext)
        {
            // _logger = logger;
            _hubContext = hubContext;

            Settings = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("./ClientApp/config.json", false, true)
                .AddEnvironmentVariables()
                .Build();

            // Channel Id
            ChannelId = Settings.GetSection("twitch").GetValue<string>("channelId");

            // set up TwitchLib API
            twitchAPI = new TwitchAPI();
            twitchAPI.Settings.ClientId = Settings.GetSection("twitch.api").GetValue<string>("client-id");
            twitchAPI.Settings.Secret = Settings.GetSection("twitch.api").GetValue<string>("secret");
        }

        /// <summary>
        /// This sets up our event listeners that'll send notifications to our overlay UI
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> SetupListeners()
        {
            try
            {
                // setup TwitchLib.PubSub
                pubSub = new TwitchPubSub();

                // PubSub Event Subscriptions
                pubSub.OnListenResponse += OnListenResponse;
                pubSub.OnPubSubServiceConnected += OnPubSubServiceConnected;
                pubSub.OnPubSubServiceClosed += OnPubSubServiceClosed;
                pubSub.OnPubSubServiceError += OnPubSubServiceError;

                // Twitch Notifications that we want to handle
                pubSub.OnBitsReceivedV2 += PubSub_OnBitsReceivedV2;
                pubSub.OnFollow += PubSub_OnFollow;
                pubSub.OnChannelSubscription += PubSub_OnChannelSubscription;
                pubSub.OnChannelPointsRewardRedeemed += PubSub_OnChannelPointsRewardRedeemed;

                // Since Twitch doesn't handle donations themselves, donations are not part of
                // the PubSub interface. If you wanted to get donation notifications, you'd
                // have to check with your donation provider for an API
#if DEBUG
                foreach (var channel in _debugChannels)
                {
                //    pubSub.ListenToBitsEventsV2(channel.Key);
                    pubSub.ListenToFollows(channel.Key);
                //    pubSub.ListenToSubscriptions(channel.Key);
                //    pubSub.ListenToChannelPoints(channel.Key);
                }
#else
                // release implementation -- get's ChannelId from config file
                // pubSub.ListenToBitsEventsV2(ChannelId);
                pubSub.ListenToFollows(ChannelId);
                // pubSub.ListenToSubscriptions(ChannelId);
                // pubSub.ListenToChannelPoints(ChannelId);
#endif

                pubSub.Connect();

                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return NotFound();
            }
        }

        #region Follow Events
        /// <summary>
        /// Handles new follow events. 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void PubSub_OnFollow(object sender, OnFollowArgs e)
        {
            // send new follower information to the UI
            _hubContext.Clients.All.SendAsync("OnFollow", e.DisplayName);
        }
        #endregion

        #region Subscribe Events
        /// <summary>
        /// Handles when a new subscription occurs,
        /// whether it's a viewer subscribing, or a gifted
        /// subscription.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void PubSub_OnChannelSubscription(object sender, OnChannelSubscriptionArgs e)
        {
            var gifted = e.Subscription.IsGift ?? false;
            // if it's a gifted sub, we want to recognize the gifter
            if (gifted)
            {
                // _logger.LogInformation();

                // if someone gifted, we want to acknowledge the gifter in our UI
                _hubContext.Clients.All.SendAsync("OnChannelSubscriptionGifted", e.Subscription.DisplayName);

            }
            // after checking for gifted status, continue with checking their sub history
            else
            {
                _hubContext.Clients.All.SendAsync("OnChannelSubscription", e.Subscription.Username, e.Subscription.CumulativeMonths);
            }
        }
        #endregion

        #region Bit Events
        /// <summary>
        /// Handles notifications from Bit donations.
        /// We can push this data to our UI to display
        /// in our overlay.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void PubSub_OnBitsReceivedV2(object sender, OnBitsReceivedV2Args e)
        {
            _hubContext.Clients.All.SendAsync("OnBitsReceived", e.UserName, e.TotalBitsUsed);
        }
        #endregion

        #region Reward Events
        /// <summary>
        /// This is where we can handle custom rewards, or even just do logging.
        /// For instance, maybe we want to track which rewards people are using 
        /// the most.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void PubSub_OnChannelPointsRewardRedeemed(object sender, OnChannelPointsRewardRedeemedArgs e)
        {
            var redemption = e.RewardRedeemed.Redemption;
            var reward = e.RewardRedeemed.Redemption.Reward;
            var redeemedUser = e.RewardRedeemed.Redemption.User;

            // I believe in here is where we can set up our custom redemption handlers. 
            // so, if we had something like a color change, in here is where we'd handle that. 
            if (redemption.Status == "UNFULFILLED")
            {

            }

            if (redemption.Status == "FULFILLED")
            {

            }

            Console.WriteLine($"Got Some Points Redeemed: {e.RewardRedeemed}");
        }

        #endregion

        #region PubSub Events
        /// <summary>
        /// Handler for errors occurring in the PubSub service
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnPubSubServiceError(object sender, OnPubSubServiceErrorArgs e)
        {
            Console.WriteLine($"Error: {e.Exception.Message}");
        }

        /// <summary>
        /// Handles when the PubSub service is closed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnPubSubServiceClosed(object sender, EventArgs e)
        {
            Console.WriteLine($"Connection closed to PubSub server");
        }

        /// <summary>
        /// Handles when the PubSub service connects
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnPubSubServiceConnected(object sender, EventArgs e)
        {
            // TODO: We're probably going to want some sort of legit oauth here... 
            Console.WriteLine($"Connected to PubSub server");
            // so, we're actually going to need to set this up to get a legit OAuth token.. 
            var oauth = ""; // Settings.GetSection("twitch.pubsub").GetValue<string>("oauth");
            pubSub.SendTopics(oauth);
        }

        /// <summary>
        /// Handler called when a listen request is successfully established
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnListenResponse(object sender, OnListenResponseArgs e)
        {
            if (e.Successful)
            {
                Console.WriteLine($"Successfully verified listening to topic: {e.Topic}");
            }
            else
            {
                // Console.WriteLine($"Failed to listen! Response {e.Response.Error}");
                try
                {
                    Console.WriteLine($"Failed to listen! Channel: {_debugChannels[e.ChannelId]}, Topic: {e.Topic}, Response: {e.Response.Error}");
                }
                catch
                {
                    Console.WriteLine($"Failed to listen! Channel: {e.ChannelId}, Topic: {e.Topic}, Response: {e.Response.Error}");
                }
            }
        }
        #endregion

        [HttpPost]
        public async Task GetRecentClips()
        {
            GetClipsResponse clipResponse =
                await twitchAPI.Helix.Clips.GetClipsAsync(broadcasterId: "");


            // clipResponse.Clips;
        }
    }
}
