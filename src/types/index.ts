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

export interface CreateApiKeyRequest {
    name: string;
    maxConcurrent?: number;
}

export interface ApiKeyResponse {
    id: string;
    key: string;
    name: string;
    maxConcurrent: number;
    currentUsage: number;
    createdAt: string;
    lastUsedAt?: string;
}

export interface UpdateApiKeyRequest {
    maxConcurrent?: number;
    name?: string;
}
