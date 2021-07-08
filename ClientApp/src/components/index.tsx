const fs = require('fs');
const path = require('path');
const got = require('got');

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    'config.json'
)));

var twitch = require(path.join(__dirname, 'twitch.js'))(config);

// example call

setTimeout(() => {
    // it should return rate limit as 799/800
    got({
        url: "https://api.twitch.tv/helix/users?login=wu_ging",
        method: "GET",
        headers: {
            "Client-ID": twitch.client.client_id,
            "Authorization": "Bearer " + twitch.client.access_token
        },
        responseType: "json"
    }).then((resp: { body: any; headers: { [x: string]: any; }; }) => {
        console.log(resp.body, resp.headers['ratelimit-remaining'], '/', resp.headers['ratelimit-limit']);
    }).catch((err: any) => {
        console.error(err);
    }).finally(() => {
        process.exit();
    });
}, 5000);

export { }