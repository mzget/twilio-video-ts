/// <reference types="node" />
import events from "events";
import { ILocalParticipant, IRemoteParticipant } from "./IParticipant";
export default interface IRoom extends events.EventEmitter {
    name: string;
    isRecording: boolean;
    localParticipant: ILocalParticipant;
    participants: Map<any, IRemoteParticipant>;
    state: string;
    sid: any;
    disconnect(): void;
    getStats(): void;
}
