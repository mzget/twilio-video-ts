"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var twilio_video_1 = __importDefault(require("twilio-video"));
var events_1 = __importDefault(require("events"));
var token;
var identity;
var activeRoom;
var previewTracks;
var localParticipant;
var videoCallEvents = new events_1.default.EventEmitter();
// Activity log.
function log(message) {
    console.log(message);
}
// Attach the Tracks to the DOM.
function attachTracks(tracks, container, onSuccess) {
    tracks.forEach(function (track) {
        try {
            var trackElement = track.attach();
            if (track.kind === 'video') {
                trackElement.style.height = '100%';
                if (container.id !== 'local-stream') {
                    trackElement.style.width = '100%';
                }
            }
            container.appendChild(trackElement);
        }
        catch (ex) {
            console.log(ex.message);
        }
    });
    if (onSuccess)
        onSuccess();
}
// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    attachTracks(tracks, container);
}
// Detach the Tracks from the DOM.
function detachTracks(tracks) {
    tracks.forEach(function (track) {
        track.detach().forEach(function (detachedElement) {
            detachedElement.remove();
        });
    });
}
// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    detachTracks(tracks);
}
function previewLocalTracks(element) {
    var localTracksPromise = previewTracks
        ? Promise.resolve(previewTracks)
        : twilio_video_1.default.createLocalTracks();
    localTracksPromise.then(function (tracks) {
        previewTracks = tracks;
        if (!!element && !element.querySelector('video')) {
            attachTracks(tracks, element);
        }
    }, function (error) {
        console.error('Unable to access local media', error);
        log('Unable to access Camera and Microphone');
    });
}
function getLocalTracks() {
    var localTracksPromise = previewTracks
        ? Promise.resolve(previewTracks)
        : twilio_video_1.default.createLocalTracks();
    return localTracksPromise;
}
function stopTracks() {
    getLocalTracks().then(function (tracks) {
        tracks.forEach(function (track) {
            track.disable();
        });
    }).catch(function (err) {
        console.error('Unable to access local media', err);
    });
}
function startTracks() {
    getLocalTracks().then(function (tracks) {
        tracks.forEach(function (track) {
            track.enable();
        });
    }).catch(function (err) {
        console.error('Unable to access local media', err);
    });
}
function setMute(mute) {
    localParticipant.audioTracks.forEach(function (track) {
        if (mute) {
            track.disable();
        }
        else {
            track.enable();
        }
    });
}
function muteParticipants() {
    console.log(activeRoom.participants);
    activeRoom.participants.forEach(function (participant) {
        var tracks = Array.from(participant.tracks.values());
        tracks.forEach(function (track) {
            console.log(track);
            if (track.kind === 'audio') {
                track.disable();
            }
        });
    });
}
function unmuteParticipants() {
    activeRoom.participants.forEach(function (participant) {
        var tracks = Array.from(participant.tracks.values());
        tracks.forEach(function (track) {
            if (track.kind === 'audio') {
                track.enable();
            }
        });
    });
}
function getLocalParticipant() {
    return localParticipant;
}
/**
 *
 * Video Bitrate, Standard Frame Rate (24, 25, 30)
 * Video Bitrate, High Frame Rate (48, 50, 60)
 */
function setLocalPaticipantParameters(bitrate) {
    if (localParticipant) {
        var encodeingParams = {
            maxVideoBitrate: bitrate,
        };
        console.log("set encoding params", encodeingParams);
        localParticipant.setParameters(encodeingParams);
        var tracks = Array.from(localParticipant.tracks.values());
        localParticipant.publishTracks(tracks);
    }
}
function createLocalTracks(audio, videoWidth) {
    if (audio === void 0) { audio = true; }
    if (videoWidth === void 0) { videoWidth = 640; }
    return __awaiter(this, void 0, void 0, function () {
        var localTracksOptions, localTracks, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    localTracksOptions = {
                        audio: audio,
                        video: { width: videoWidth }
                    };
                    return [4 /*yield*/, twilio_video_1.default.createLocalTracks(localTracksOptions)];
                case 1:
                    localTracks = _a.sent();
                    return [2 /*return*/, localTracks];
                case 2:
                    ex_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(ex_1)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createLocalTracks = createLocalTracks;
exports.default = {
    startWebRTC: function () {
        return new Promise(function (resolve, rejected) {
            axios_1.default.get('https://voipapi.ooca.co/token')
                .then(function (response) {
                console.log('data', response.data);
                var data = response.data;
                identity = data.identity;
                token = data.token;
                resolve();
            })
                .catch(function (error) {
                console.log(error);
                rejected(error);
            });
        });
    },
    connect: function (roomName, previewTracks) {
        return new Promise(function (resolve, reject) {
            var connectOptions = {
                name: roomName,
            };
            if (previewTracks) {
                connectOptions.tracks = previewTracks;
            }
            // Join the Room with the token from the server and the
            // LocalParticipant's Tracks.
            twilio_video_1.default.connect(token, connectOptions)
                .then(function (room) { resolve(room); })
                .catch(function (error) { reject(error); });
        });
    },
    // Successfully connected!
    roomJoined: function (room) {
        activeRoom = room;
        console.log("Joined as " + identity);
        var tracks = Array.from(room.localParticipant.tracks.values());
        localParticipant = room.localParticipant;
        videoCallEvents.emit('readyStream', room.localParticipant);
        videoCallEvents.emit('alreadyInRoom', room.participants);
        // Attach the Tracks of the Room's Participants.
        room.participants.forEach(function (participant) {
            log("Already in Room: " + participant.identity);
            // const remoteContainer = document.getElementById('remote-media');
            // attachParticipantTracks(participant, remoteContainer);
        });
        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackAdded', function (track, participant) {
            console.log(participant.identity + " added track: " + track.kind);
            // const remoteContainer = document.getElementById('remote-media');
            // attachTracks([track], remoteContainer);
            videoCallEvents.emit('trackAdded', { track: track, participant: participant });
        });
        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackRemoved', function (track, participant) {
            console.log(participant.identity + " + 'removed track:' + " + track.kind);
            detachTracks([track]);
            videoCallEvents.emit('trackRemoved', { track: track, participant: participant });
        });
        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function (participant) {
            console.log("participant-Connected: " + participant.identity);
            videoCallEvents.emit('participantConnected', participant);
        });
        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', function (participant) {
            console.log("participant-Disconnected " + participant.identity + " left the room");
            videoCallEvents.emit('participantDisconnected', participant);
            detachParticipantTracks(participant);
        });
        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', function () {
            console.log('room.on-disconnected');
            if (previewTracks) {
                previewTracks.forEach(function (track) {
                    track.stop();
                });
            }
            detachParticipantTracks(room.localParticipant);
            room.participants.forEach(detachParticipantTracks);
            // Detach the local media elements
            room.localParticipant.tracks.forEach(function (track) {
                var attachedElements = track.detach();
                attachedElements.forEach(function (element) {
                    element.remove();
                });
            });
            activeRoom = undefined;
        });
        room.on('reconnecting', function (error) {
            // Warn and/or update your application's UI.
            console.warn('Reconnecting!', error);
        });
        room.on('reconnected', function () {
            // Log and/or update your application's UI.
            console.warn('Reconnected!');
        });
    },
    // Leave Room.
    leaveRoomIfJoined: function () {
        if (activeRoom) {
            activeRoom.disconnect();
            console.log('room.disconnected');
        }
        videoCallEvents.removeAllListeners();
        previewTracks = undefined;
    },
    attachTracks: attachTracks,
    previewLocalTracks: previewLocalTracks,
    getLocalTracks: getLocalTracks,
    stopTracks: stopTracks,
    startTracks: startTracks,
    attachParticipantTracks: attachParticipantTracks,
    setMute: setMute,
    muteParticipants: muteParticipants,
    unmuteParticipants: unmuteParticipants,
    activeRoom: function () {
        return activeRoom;
    },
    videoCallEvents: videoCallEvents,
    getPreviewTracks: function () {
        return previewTracks;
    },
    localAudioTracks: function () {
        return Array.from(localParticipant.audioTracks.values());
    },
    getLocalVideoTracks: function () {
        return Array.from(localParticipant.videoTracks.values());
    },
    getLocalParticipant: getLocalParticipant,
    setLocalPaticipantParameters: setLocalPaticipantParameters,
};
