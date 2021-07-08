"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var got = require('got');
// Load configuration
var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
var twitch = require(path.join(__dirname, 'twitch.js'))(config);
// example call
setTimeout(function () {
    // it should return rate limit as 799/800
    got({
        url: "https://api.twitch.tv/helix/users?login=wu_ging",
        method: "GET",
        headers: {
            "Client-ID": twitch.client.client_id,
            "Authorization": "Bearer " + twitch.client.access_token
        },
        responseType: "json"
    }).then(function (resp) {
        console.log(resp.body, resp.headers['ratelimit-remaining'], '/', resp.headers['ratelimit-limit']);
    }).catch(function (err) {
        console.error(err);
    }).finally(function () {
        process.exit();
    });
}, 5000);
//# sourceMappingURL=index.js.map