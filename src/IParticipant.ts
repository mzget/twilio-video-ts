import { IEncodingParameters } from "./IEncodingParameters";
import { ILocalTrack, IRemoteTrack, ILocalAudioTrack } from "./ITrack";

export interface IParticipant {
    /**The Participant's AudioTracks. */
    audioTracks: Map<string, ILocalAudioTrack>;
    /**The Participant's DataTracks. */
    dataTracks: Map<any, any>;
    /**The identity of the Participant */
    identity: string;
    /**The Participant's SID */
    sid: string;
    /**"connected", "disconnected" or "failed" */
    state: string;
    tracks: Map<any, any>;
    /**
     * The Participant's VideoTracks.
     */
    videoTracks: Map<any, any>;
}

export interface IRemoteParticipant extends IParticipant {
    audioTracks: any;
    dataTracks: any;
    tracks: Map<string, IRemoteTrack>;
    videoTracks: any;
}

export interface ILocalParticipant extends IParticipant {
    /**
     * The Participant's Tracks
     */
    tracks: Map<any, ILocalTrack>;
    setParameters(encodingParameters: IEncodingParameters): void;
    publishTrack(localTrack: ILocalTrack): void;
    publishTracks(tracks: Array<ILocalTrack>): void;
    publishTrack(mediaStreamTrack: any, options: any): void;
    unpublishTrack(track: ILocalTrack): void;
    unpublishTracks(tracks: Array<ILocalTrack>): void;
}