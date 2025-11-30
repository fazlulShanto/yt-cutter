import { DownloadConfig, QueryParams } from '../types';

/**
 * Validate and normalize configuration from query parameters
 * @param queryParams - Query parameters from request
 * @returns Validated configuration object
 * @throws Error if validation fails
 */
function validateConfig(queryParams: QueryParams): DownloadConfig {
    const config: DownloadConfig = {
        url: queryParams.url || '',
        start: queryParams.start || '',
        end: queryParams.end || '',
        type: (queryParams.type as DownloadConfig['type']) || 'video+audio',
        videoRes: (queryParams.videoRes as DownloadConfig['videoRes']) || '720',
        audioRes: (queryParams.audioRes as DownloadConfig['audioRes']) || '128',
        format: (queryParams.format as DownloadConfig['format']) || 'mp4'
    };

    // Validate required fields
    if (!config.url) {
        throw new Error('Missing "url" parameter');
    }
    if (!config.start || !config.end) {
        throw new Error('Missing "start" or "end" parameters');
    }

    // Validate type
    const validTypes: DownloadConfig['type'][] = ['video+audio', 'video', 'audio'];
    if (!validTypes.includes(config.type)) {
        throw new Error(`Invalid "type". Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate video resolution
    const validVideoRes: DownloadConfig['videoRes'][] = ['480', '720'];
    if (!validVideoRes.includes(config.videoRes)) {
        throw new Error(`Invalid "videoRes". Must be one of: ${validVideoRes.join(', ')}`);
    }

    // Validate audio resolution
    const validAudioRes: DownloadConfig['audioRes'][] = ['96', '128'];
    if (!validAudioRes.includes(config.audioRes)) {
        throw new Error(`Invalid "audioRes". Must be one of: ${validAudioRes.join(', ')}`);
    }

    // Validate format
    const validFormats: DownloadConfig['format'][] = ['mp4', 'wav'];
    if (!validFormats.includes(config.format)) {
        throw new Error(`Invalid "format". Must be one of: ${validFormats.join(', ')}`);
    }

    // Audio-only should use wav format (optional enforcement)
    if (config.type === 'audio' && config.format === 'mp4') {
        console.warn('Audio-only download with mp4 format - consider using wav');
    }

    return config;
}

export {
    validateConfig
};
