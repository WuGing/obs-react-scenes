# obs-react-scenes
This is a project that I've been working on for use in my Twitch live streams. 

Finding myself dissatisfied with the overlay options available, and the difficulty present in modifying them, 
I elected to begin with a more stripped down framework, allowing for conventional HTML and CSS modification
using the React framework for the front-end, with a .NET back-end. 

The project publishes to a Linux Container for maximum portability. After installation, add the necessary 
Environment Variables, and add to your overlay in OBS using Browser Sources.

## Project Setup
Some configuration is required prior to running the project. 

Inside the Dockerfile, you'll find several ENV (Environment Variables) that will need populating.

You'll need:

* Twitch Channel Name (your Twitch username)
* Twitch Channel ID
* Twitch API Client ID
* Twitch API Secret
* Twitch PubSub OAuth

You can find the API Client ID and Secret at https://dev.twitch.tv/console

You can generate an OAuth token at https://twitchtokengenerator.com/

## Installation
If installing, the same Variables will need to be added to your Docker Container.

## Referenced Libraries
**TwitchLib v2.3.x:** https://github.com/TwitchLib/TwitchLib <br />
**SignalR v2.4.2:** https://www.asp.net/signalr