/**
 * Validate and normalize configuration from query parameters
 * @param {Object} queryParams - Query parameters from request
 * @returns {Object} Validated configuration object
 * @throws {Error} If validation fails
 */
function validateConfig(queryParams) {
    const config = {
        url: queryParams.url,
        start: queryParams.start,
        end: queryParams.end,
        type: queryParams.type || 'video+audio',
        videoRes: queryParams.videoRes || '720',
        audioRes: queryParams.audioRes || '128',
        format: queryParams.format || 'mp4'
    };

    // Validate required fields
    if (!config.url) {
        throw new Error('Missing "url" parameter');
    }
    if (!config.start || !config.end) {
        throw new Error('Missing "start" or "end" parameters');
    }

    // Validate type
    const validTypes = ['video+audio', 'video', 'audio'];
    if (!validTypes.includes(config.type)) {
        throw new Error(`Invalid "type". Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate video resolution
    const validVideoRes = ['480', '720'];
    if (!validVideoRes.includes(config.videoRes)) {
        throw new Error(`Invalid "videoRes". Must be one of: ${validVideoRes.join(', ')}`);
    }

    // Validate audio resolution
    const validAudioRes = ['96', '128'];
    if (!validAudioRes.includes(config.audioRes)) {
        throw new Error(`Invalid "audioRes". Must be one of: ${validAudioRes.join(', ')}`);
    }

    // Validate format
    const validFormats = ['mp4', 'wav'];
    if (!validFormats.includes(config.format)) {
        throw new Error(`Invalid "format". Must be one of: ${validFormats.join(', ')}`);
    }

    // Audio-only should use wav format (optional enforcement)
    if (config.type === 'audio' && config.format === 'mp4') {
        console.warn('Audio-only download with mp4 format - consider using wav');
    }

    return config;
}

module.exports = {
    validateConfig
};
