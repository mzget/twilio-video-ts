import axios from 'axios';
import Video from 'twilio-video';
import event from 'events';

/**
 * Twilio video 1.9.0 compatible.
 */
import { ILocalParticipant } from "./IParticipant";
import { IEncodingParameters } from "./IEncodingParameters";
import IRoom from "./IRoom";
import IConnectOptions, {
  CreateLocalTracksOptions, CreateLocalTrackOptions
} from "./IConnectOptions";
import { ILocalTrack, IRemoteTrack } from "./ITrack";

let token: string;
let identity: string;
let activeRoom: IRoom | undefined;
let previewTracks: Array<ILocalTrack> | undefined;
let localParticipant: ILocalParticipant;
const videoCallEvents = new event.EventEmitter();

// Activity log.
function log(message: string) {
  console.log(message);
}

// Attach the Tracks to the DOM.
function attachTracks(tracks: Array<ILocalTrack>, container: any, onSuccess?: () => void) {
  tracks.forEach((track) => {
    try {
      const trackElement = track.attach() as any;
      if (track.kind === 'video') {
        trackElement.style.height = '100%';
        if (container.id !== 'local-stream') {
          trackElement.style.width = '100%';
        }
      }
      container.appendChild(trackElement);
    } catch (ex) {
      console.log(ex.message);
    }
  });

  if (onSuccess)
    onSuccess();
}
// Attach the Participant's Tracks to the DOM.
function attachParticipantTracks(participant, container) {
  const tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}
// Detach the Tracks from the DOM.
function detachTracks(tracks) {
  tracks.forEach((track) => {
    track.detach().forEach((detachedElement) => {
      detachedElement.remove();
    });
  });
}
// Detach the Participant's Tracks from the DOM.
function detachParticipantTracks(participant) {
  const tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

function previewLocalTracks(element: any) {
  const localTracksPromise = previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks() as Promise<Array<ILocalTrack>>;

  localTracksPromise.then((tracks: Array<ILocalTrack>) => {
    previewTracks = tracks;
    if (!!element && !element.querySelector('video')) {
      attachTracks(tracks, element);
    }
  }, (error) => {
    console.error('Unable to access local media', error);
    log('Unable to access Camera and Microphone');
  });
}
function getLocalTracks() {
  const localTracksPromise = previewTracks
    ? Promise.resolve(previewTracks)
    : Video.createLocalTracks();

  return localTracksPromise;
}
function stopTracks() {
  getLocalTracks().then((tracks) => {
    tracks.forEach((track) => {
      track.disable();
    });
  }).catch((err: any) => {
    console.error('Unable to access local media', err);
  });
}
function startTracks() {
  getLocalTracks().then((tracks) => {
    tracks.forEach((track) => {
      track.enable();
    });
  }).catch((err) => {
    console.error('Unable to access local media', err);
  });
}
function setMute(mute: boolean) {
  localParticipant.audioTracks.forEach(track => {
    if (mute) {
      track.disable();
    }
    else {
      track.enable();
    }
  });
}
function muteParticipants() {
  console.log((activeRoom as IRoom).participants);

  (activeRoom as IRoom).participants.forEach(participant => {
    const tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
      console.log(track);
      if (track.kind === 'audio') {
        track.disable();
      }
    });
  });
}
function unmuteParticipants() {
  (activeRoom as IRoom).participants.forEach(participant => {
    const tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
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
function setLocalPaticipantParameters(bitrate: number | null) {
  if (localParticipant) {
    const encodeingParams = {
      maxVideoBitrate: bitrate,
    } as IEncodingParameters;

    console.log("set encoding params", encodeingParams);

    localParticipant.setParameters(encodeingParams);

    const tracks = Array.from(localParticipant.tracks.values());
    localParticipant.publishTracks(tracks);
  }
}

export async function createLocalTracks(audio = true, videoWidth = 640) {
  try {
    const localTracksOptions = {
      audio: audio,
      video: { width: videoWidth }
    } as CreateLocalTracksOptions;

    // Request audio and video tracks
    const localTracks: Array<ILocalTrack> = await Video.createLocalTracks(localTracksOptions);
    return localTracks;
  } catch (ex) {
    return Promise.reject(ex);
  }
}

export const TwilioVideo = {
  startWebRTC() {
    return new Promise((resolve, rejected) => {
      axios.get('https://voipapi.ooca.co/token')
        .then((response) => {
          console.log('data', response.data);
          const data = response.data;
          identity = data.identity;
          token = data.token;

          resolve();
        })
        .catch((error) => {
          console.log(error);
          rejected(error);
        });
    });
  },
  connect(roomName: string, previewTracks: Array<ILocalTrack>) {
    return new Promise((resolve: (room: IRoom) => void, reject) => {
      const connectOptions = {
        name: roomName,
        // logLevel: 'warn',
        // maxVideoBitrate: 30
      } as IConnectOptions;

      if (previewTracks) {
        connectOptions.tracks = previewTracks;
      }

      // Join the Room with the token from the server and the
      // LocalParticipant's Tracks.
      Video.connect(token, connectOptions)
        .then((room: IRoom) => { resolve(room); })
        .catch((error: any) => { reject(error); });
    });
  },
  // Successfully connected!
  roomJoined(room: IRoom) {
    activeRoom = room;

    console.log(`Joined as ${identity}`);

    const tracks = Array.from(room.localParticipant.tracks.values());
    localParticipant = room.localParticipant;

    videoCallEvents.emit('readyStream', room.localParticipant);
    videoCallEvents.emit('alreadyInRoom', room.participants);

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach((participant) => {
      log(`Already in Room: ${participant.identity}`);
      // const remoteContainer = document.getElementById('remote-media');
      // attachParticipantTracks(participant, remoteContainer);
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      console.log(`${participant.identity} added track: ${track.kind}`);
      // const remoteContainer = document.getElementById('remote-media');
      // attachTracks([track], remoteContainer);

      videoCallEvents.emit('trackAdded', { track, participant });
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.log(`${participant.identity} + 'removed track:' + ${track.kind}`);
      detachTracks([track]);
      videoCallEvents.emit('trackRemoved', { track, participant });
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', (participant) => {
      console.log(`participant-Connected: ${participant.identity}`);
      videoCallEvents.emit('participantConnected', participant);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', (participant) => {
      console.log(`participant-Disconnected ${participant.identity} left the room`);
      videoCallEvents.emit('participantDisconnected', participant);
      detachParticipantTracks(participant);
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      console.log('room.on-disconnected');

      if (previewTracks) {
        previewTracks.forEach((track) => {
          track.stop();
        });
      }
      detachParticipantTracks(room.localParticipant);
      room.participants.forEach(detachParticipantTracks);
      // Detach the local media elements
      room.localParticipant.tracks.forEach((track) => {
        const attachedElements = track.detach();
        attachedElements.forEach((element) => {
          element.remove();
        });
      });
      activeRoom = undefined;
    });

    room.on('reconnecting', error => {
      // Warn and/or update your application's UI.
      console.warn('Reconnecting!', error);
    });

    room.on('reconnected', () => {
      // Log and/or update your application's UI.
      console.warn('Reconnected!');
    });
  },
  // Leave Room.
  leaveRoomIfJoined() {
    if (activeRoom) {
      activeRoom.disconnect();
      console.log('room.disconnected');
    }
    videoCallEvents.removeAllListeners();

    previewTracks = undefined;
  },
  attachTracks,
  previewLocalTracks,
  getLocalTracks,
  stopTracks,
  startTracks,
  attachParticipantTracks,
  setMute,
  muteParticipants,
  unmuteParticipants,
  activeRoom() {
    return activeRoom;
  },
  videoCallEvents,
  getPreviewTracks() {
    return previewTracks;
  },
  localAudioTracks() {
    return Array.from(localParticipant.audioTracks.values());
  },
  getLocalVideoTracks() {
    return Array.from(localParticipant.videoTracks.values());
  },
  getLocalParticipant,
  setLocalPaticipantParameters,
};
