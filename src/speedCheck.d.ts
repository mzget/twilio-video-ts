export declare const onSpeedChangedHandler: ((ok: boolean) => void)[];
export declare function addSpeedChangeListener(speedChangeListener: (ok: boolean) => void): void;
export declare function removeSpeedChangeListener(speedChangeListener: (ok: boolean) => void): void;
export declare function removeSpeedCheck(): void;
declare function speedCheck(_internetProps: any): void;
export default speedCheck;
