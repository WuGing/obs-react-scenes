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
using OBSReactScenes.Notifications;

using TwitchLib.Api;
using TwitchLib.Api.Core.Enums;
using TwitchLib.Api.Helix.Models.Ads;
using TwitchLib.Api.Helix.Models.Clips.GetClips;
using TwitchLib.Api.Helix.Models.Schedule;
using TwitchLib.Api.Helix.Models.Schedule.GetChannelStreamSchedule;
using TwitchLib.Api.V5.Models.Channels;

using TwitchLib.PubSub;
using TwitchLib.PubSub.Events;

using TwitchLib.Client;
using TwitchLib.Client.Extensions;
using TwitchLib.Client.Models;
using Microsoft.Extensions.Options;

namespace OBSReactScenes.Controllers
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
        private readonly EnvironmentConfig _configuration;
        private readonly ILogger<TwitchWebhooksController> _logger;

        private readonly TwitchAPI _twitchAPI;
        private TwitchClient _twitchClient;
        private TwitchPubSub _twitchPubSub;

        // settings strings
        private readonly string _channelId;

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

        public TwitchWebhooksController(IHubContext<NotificationHub> hubContext, IOptions<EnvironmentConfig> configuration, ILogger<TwitchWebhooksController> logger)
        {
            _hubContext = hubContext;
            _configuration = configuration.Value;
            _logger = logger;

            // channelId string
            _channelId = _configuration.Twitch_ChannelId;

            // TwitchLib API Settings
            _twitchAPI = new TwitchAPI();
            _twitchAPI.Settings.ClientId = _configuration.Twitch_Api_ClientId;
            _twitchAPI.Settings.Secret = _configuration.Twitch_Api_Secret;
            // _twitchAPI.Settings.AccessToken = _configuration.Twitch_PubSub_OAuth;

            ConnectionCredentials credentials = 
                new ConnectionCredentials(
                    _configuration.Twitch_ChannelName,
                    _configuration.Twitch_PubSub_OAuth);

            _twitchClient = new TwitchClient();
            _twitchClient.Initialize(credentials, _channelId);
            _twitchClient.Connect();
            _twitchClient.OnRaidNotification += TwitchClient_OnRaidNotification;
            // _twitchClient.OnRaidNotification()  // TODO: This might be what we need for grabbing the Raid notification

            // TODO: Will need to add Goal support as that's built out. 

            Authenticate();
        }

        private void Authenticate()
        {
            string accessToken;

            try
            {
                IEnumerable<AuthScopes> authScopes = new List<AuthScopes> {
                    AuthScopes.Any
                };

                _twitchAPI.ThirdParty.AuthorizationFlow.CreateFlow("Wu Overlay Test", authScopes);

                _twitchAPI.Settings.AccessToken = _twitchAPI.ThirdParty.AuthorizationFlow.GetAccessToken();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
        }

        #region Endpoints

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
                _twitchPubSub = new TwitchPubSub();

                // PubSub Event Subscriptions
                _twitchPubSub.OnListenResponse += OnListenResponse;
                _twitchPubSub.OnPubSubServiceConnected += OnPubSubServiceConnected;
                _twitchPubSub.OnPubSubServiceClosed += OnPubSubServiceClosed;
                _twitchPubSub.OnPubSubServiceError += OnPubSubServiceError;

                // Twitch notification handler for follows
                _twitchPubSub.OnFollow += PubSub_OnFollow;

                // TODO: Raid detection might be supported through TwitchLib.Client

                // Since Twitch doesn't handle donations themselves, donations are not part of
                // the PubSub interface. If you wanted to get donation notifications, you'd
                // have to check with your donation provider for an API

#if DEBUG
                foreach (var channel in _debugChannels)
                {
                    _twitchPubSub.ListenToFollows(channel.Key);
                }
#else
                // We need to try and check if the broadcaster is a partner or affiliate
                Channel broadcasterChannel = 
                    await _twitchAPI.V5.Channels.GetChannelByIDAsync(_channelId);

                // release implementation
                _twitchPubSub.ListenToFollows(_channelId);
                _twitchPubSub.ListenToRaid(_channelId);

                // the following only apply to affiliate and partnered channels
                if (IsAffiliateOrPartnered(broadcasterChannel))
                {
                    // Twitch Affiliate/Partner notification handlers
                    _twitchPubSub.OnBitsReceivedV2 += PubSub_OnBitsReceivedV2;
                    _twitchPubSub.OnChannelSubscription += PubSub_OnChannelSubscription;
                    _twitchPubSub.OnChannelPointsRewardRedeemed += PubSub_OnChannelPointsRewardRedeemed;

                    // Twitch Affiliate/Partner listen requests
                    _twitchPubSub.ListenToBitsEventsV2(_channelId);
                    _twitchPubSub.ListenToChannelPoints(_channelId);
                    _twitchPubSub.ListenToSubscriptions(_channelId);
                }
#endif

                _twitchPubSub.Connect();

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return NotFound();
            }
        }

        [HttpGet]
        public async Task<Clip[]> GetRecentClips()
        {
            try
            {
                var recentClips =
                    await _twitchAPI.Helix.Clips.GetClipsAsync(broadcasterId: _channelId);

                return recentClips.Clips;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return new Clip[] { };
        }

        #region Commercials
        // TODO: We need to test and make sure this appears to work 
        [HttpGet]
        public async Task<IActionResult> CommercialBreak(CommercialLength breakLength)
        {
            try
            {
                StartCommercialRequest startCommercialRequest = new StartCommercialRequest()
                {
                    BroadcasterId = _channelId,
                    Length = (int)breakLength
                };

                StartCommercialResponse startCommercialResponse =
                    await _twitchAPI.Helix.Ads.StartCommercial(startCommercialRequest);

                // if our response message is empty, we succeeded
                if (string.IsNullOrEmpty(startCommercialResponse.Message))
                {
                    _logger.LogInformation($"Commercials started and will play for {startCommercialResponse.Length} seconds");
                    return Ok();
                }
                // otherwise, there might be an issue... 
                else
                {
                    _logger.LogInformation($"Commercial roll failed: {startCommercialResponse.Message}; Retry: {startCommercialResponse.RetryAfter}");
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(ex);
            }
        }
        #endregion

        /// <summary>
        /// Gets the channels stream schedule. 
        /// We can then display that schedule in our overlay
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetChannelSchedule()
        {
            try
            {
                GetChannelStreamScheduleResponse channelStreamScheduleResponse =
                    await _twitchAPI.Helix.Schedule.GetChannelStreamScheduleAsync(_channelId);

                ChannelStreamSchedule channelStreamSchedule = channelStreamScheduleResponse.Schedule;

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest(ex);
            }
        }
        #endregion

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
                // if someone gifted, we want to acknowledge the gifter in our UI
                _hubContext.Clients.All.SendAsync("OnChannelSubscriptionGifted", e.Subscription.DisplayName);
                _logger.LogInformation($"{e.Subscription.DisplayName} has gifted a sub");
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

            // TODO: I believe in here is where we can set up our custom redemption handlers. 
            // so, if we had something like a color change, in here is where we'd handle that. 
            if (redemption.Status == "UNFULFILLED")
            {

            }

            if (redemption.Status == "FULFILLED")
            {

            }

            _logger.LogInformation($"Got Some Points Redeemed: {e.RewardRedeemed}");
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
            _logger.LogError($"Error: {e.Exception.Message}");
        }

        /// <summary>
        /// Handles when the PubSub service is closed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnPubSubServiceClosed(object sender, EventArgs e)
        {
            _logger.LogError($"Connection closed to PubSub server");
        }

        /// <summary>
        /// Handles when the PubSub service connects
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnPubSubServiceConnected(object sender, EventArgs e)
        {
            // TODO: We're probably going to want some sort of legit oauth here... 
            _logger.LogInformation($"Connected to PubSub server");
            // so, we're actually going to need to set this up to get a legit OAuth token.. 
            var oauth = _configuration.Twitch_PubSub_OAuth;
            _twitchPubSub.SendTopics(oauth);
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
                _logger.LogInformation($"Successfully verified listening to topic: {e.Topic}");
            }
            else
            {
                // Console.WriteLine($"Failed to listen! Response {e.Response.Error}");
#if DEBUG
                _logger.LogError($"Failed to listen! Channel: {_debugChannels[e.ChannelId]}, Topic: {e.Topic}, Response: {e.Response.Error}");
#else
                _logger.LogError($"Failed to listen! Channel: {e.ChannelId}, Topic: {e.Topic}, Response: {e.Response.Error}");
#endif
            }
        }
#endregion

#region Raid Events
        private void TwitchClient_OnRaidNotification(object sender, TwitchLib.Client.Events.OnRaidNotificationArgs e)
        {
            throw new NotImplementedException();
        }
#endregion

#region Helper Functions
        /// <summary>
        /// Checks if a Twitch Broadcaster is Partnered or Affiliated
        /// </summary>
        /// <param name="broadcastChannel"></param>
        /// <returns>bool indicating Partnered/Affiliate status</returns>
        public bool IsAffiliateOrPartnered(Channel broadcastChannel)
        {
            return !string.IsNullOrEmpty(broadcastChannel.BroadcasterType);
        }
#endregion
    }
}
