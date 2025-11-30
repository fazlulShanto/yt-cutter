export interface DownloadConfig {
    url: string;
    start: string;
    end: string;
    type: 'video+audio' | 'video' | 'audio';
    videoRes: '480' | '720';
    audioRes: '96' | '128';
    format: 'mp4' | 'wav';
}

export interface ApiResponse {
    success: boolean;
    downloadUrl?: string;
    fileSize?: number;
    format?: string;
    error?: string;
}

export interface PlatformInfo {
    ytDlpPath: string;
    binDir: string;
}

export interface QueryParams {
    url?: string;
    start?: string;
    end?: string;
    type?: string;
    videoRes?: string;
    audioRes?: string;
    format?: string;
}
