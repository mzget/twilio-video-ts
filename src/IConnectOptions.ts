export default interface IConnectOptions {
    audio: boolean | CreateLocalTrackOptions;
    video: boolean | CreateLocalTrackOptions;
    iceServers: Array<any>;
    iceTransportPolicy: any;
    insights: boolean;
    maxAudioBitrate: number;
    maxVideoBitrate: number;
    name: string;
    preferredAudioCodecs: Array<any>;
    preferredVideoCodecs: Array<any>;
    logLevel: any;
    tracks: Array<any>;
}

export interface CreateLocalTracksOptions {
    audio: boolean | CreateLocalTrackOptions;
    video: boolean | CreateLocalTrackOptions;
    logLevel: any;
}

export interface CreateLocalTrackOptions {
    name: string;
    logLevel: any;
    width?: number;
}