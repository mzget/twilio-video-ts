/**
 * Twilio video 1.9.0 compatible.
 */
import { ILocalParticipant } from "./IParticipant";
import IRoom from "./IRoom";
import { ILocalTrack } from "./ITrack";
export declare function createLocalTracks(audio?: boolean, videoWidth?: number): Promise<any>;
declare const _default: {
    startWebRTC(): any;
    connect(roomName: string, previewTracks: ILocalTrack[]): any;
    roomJoined(room: IRoom): void;
    leaveRoomIfJoined(): void;
    attachTracks: (tracks: ILocalTrack[], container: any, onSuccess?: (() => void) | undefined) => void;
    previewLocalTracks: (element: any) => void;
    getLocalTracks: () => any;
    stopTracks: () => void;
    startTracks: () => void;
    attachParticipantTracks: (participant: any, container: any) => void;
    setMute: (mute: boolean) => void;
    muteParticipants: () => void;
    unmuteParticipants: () => void;
    activeRoom(): IRoom | undefined;
    videoCallEvents: any;
    getPreviewTracks(): ILocalTrack[] | undefined;
    localAudioTracks(): any;
    getLocalVideoTracks(): any;
    getLocalParticipant: () => ILocalParticipant;
    setLocalPaticipantParameters: (bitrate: number | null) => void;
};
export default _default;
