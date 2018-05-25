import * as Video from "ooca-twilio-video";

Video.TwilioVideo.startWebRTC().then(() => {
    Video.TwilioVideo.connect("", undefined)
        .then(room => {

        })
        .catch(err => {

        });
}).catch(err => console.warn("No authorized token"));
