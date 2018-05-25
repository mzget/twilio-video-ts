// Recommended video bitrates for SDR uploads
// Type	Video Bitrate, Standard Frame Rate (24, 25, 30)	Video Bitrate, High Frame Rate (48, 50, 60)
// 1080p	8 Mbps	12 Mbps
// 720p	5 Mbps	7.5 Mbps
// 480p	2.5 Mbps	4 Mbps
// 360p	1 Mbps	1.5 Mbps

export interface IEncodingParameters {
    maxAudioBitrate?: number;
    maxVideoBitrate?: number;
}