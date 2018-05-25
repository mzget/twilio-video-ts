export default interface ITrack {
    /**
     * The Track ID is a string identifier for the Track.
     */
    id: string;
    /**
     * The Track kind is either "audio", "video", or "data".
     */
    kind: string;
    name: string;
    /**
     * Create an HTMLVideoElement and attach the VideoTrack to it.
     * The HTMLVideoElement's srcObject will be set to a new MediaStream containing the VideoTrack's MediaStreamTrack.
     */
    attach(): void;
    /**
     * Detach the VideoTrack from all previously attached HTMLMediaElements.
     */
    detach(): void;
}
export interface ILocalTrack extends ITrack {
    stop(): void;
    /**
     * Enable the LocalVideoTrack. This is effectively "unpause".
     */
    enable(): void;
    /**
     * Disable the LocalVideoTrack. This is effectively "pause".
     */
    disable(): void;
    /**
     *
     * @param enabled Enable or disable the LocalVideoTrack. This is effectively "unpause" or "pause".
     */
    enable(enabled: boolean): void;
}
export interface ILocalAudioTrack {
    /**
     * Create an HTMLAudioElement and attach the AudioTrack to it.
     */
    attach(): void;
    /**
     * Detach the AudioTrack from all previously attached HTMLMediaElements.
     */
    detach(): void;
    /**
     * Disable the LocalAudioTrack. This is effectively "mute".
     */
    disable(): void;
    /**
     * Enable the LocalAudioTrack. This is effectively "unmute".
     */
    enable(): void;
    /**
     * Calls stop on the underlying MediaStreamTrack. If you choose to stop a LocalAudioTrack, you should unpublish it after stopping.
     */
    stop(): void;
}
export declare abstract class RemoteVideoTrack {
    attach(): void;
    detach(): void;
}
export interface IRemoteTrack extends ITrack {
}
