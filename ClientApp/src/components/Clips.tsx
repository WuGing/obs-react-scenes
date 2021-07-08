import * as React from 'react';
import * as signalR from "@microsoft/signalr";

export default class Clips extends React.PureComponent {

    public componentDidMount() {
        // this will need to make a call to the API so we can get a list of our videos

        // we will then... somehow... rotate through those videos, changing
        // the video source to match the next one (or however that works)

        // Probably need some classing to for the video.
        // 1280x720 for now, since we shouldn't really be doing 1080p yet anyhow
    }

    public render() {
        return (
            <React.Fragment>
                <video src="https://production.assets.clips.twitchcdn.net/AT-cm%7C1172792820.mp4?sig=ee192627523271a6ab3ab258fd90e2f1d86bf538&token=%7B%22authorization%22%3A%7B%22forbidden%22%3Afalse%2C%22reason%22%3A%22%22%7D%2C%22clip_uri%22%3A%22https%3A%2F%2Fproduction.assets.clips.twitchcdn.net%2FAT-cm%257C1172792820.mp4%22%2C%22device_id%22%3A%22hK4IpharVfHK6CPEu6JDhrwRMqFD0mwQ%22%2C%22expires%22%3A1623510534%2C%22user_id%22%3A%22141867254%22%2C%22version%22%3A2%7D"></video>
            </React.Fragment>
        );
    }
}