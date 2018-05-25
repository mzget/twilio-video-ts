import * as Video from "twilio-video-ts";

Video.TwilioVideo.startWebRTC().then(() => {
    Video.TwilioVideo.connect("", undefined)
        .then(room => {

        })
        .catch(err => {

        });
}).catch(err => console.warn("No authorized token"));
