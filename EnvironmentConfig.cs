using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OBSReactScenes
{
    /// <summary>
    /// Used to help get the environment variables set
    /// in the Docker container
    /// </summary>
    public class EnvironmentConfig
    {
        /// <summary>
        /// single channel to listen to, this is the name
        /// </summary>
        public string Twitch_ChannelName { get; set; }
        /// <summary>
        /// the converted channel name;
        /// can be done with https://chrome.google.com/webstore/detail/twitch-username-and-user/laonpoebfalkjijglbjbnkfndibbcoon
        /// </summary>
        public string Twitch_ChannelId { get; set; }

        // Twitch Api Config
        /// <summary>
        /// Get both of these values from https://dev.twitch.tv/console
        /// </summary>
        public string Twitch_Api_ClientId { get; set; }
        /// <summary>
        /// Get both of these values from https://dev.twitch.tv/console
        /// </summary>
        public string Twitch_Api_Secret { get; set; }
        public string Twitch_Api_CallbackUrl { get; set; }

        // Twitch PubSub Config
        /// <summary>
        /// Generated with the scopes you want to use https://twitchtokengenerator.com/.
        /// This needs to be generated by the broadcaster for some events
        /// </summary>
        public string Twitch_PubSub_OAuth { get; set; }

        // YouTube Config
        public string YouTube_ChannelId { get; set; }

    }
}
