import { DownloadConfig } from '../types';

/**
 * Build yt-dlp format string based on configuration
 * @param config - Validated configuration object
 * @returns Format string for yt-dlp
 */
function buildFormatString(config: DownloadConfig): string {
    const { type, videoRes, audioRes } = config;

    if (type === 'video+audio') {
        // Best video at specified resolution + best audio at specified bitrate
        return `bestvideo[height<=${videoRes}]+bestaudio[abr<=${audioRes}]/best[height<=${videoRes}]`;
    } else if (type === 'video') {
        // Video only at specified resolution
        return `bestvideo[height<=${videoRes}]`;
    } else if (type === 'audio') {
        // Audio only at specified bitrate
        return `bestaudio[abr<=${audioRes}]/best`;
    }

    throw new Error(`Invalid type: ${type}`);
}

/**
 * Build yt-dlp arguments array
 * @param config - Validated configuration object
 * @param outputPath - Output file path
 * @returns Arguments array for yt-dlp
 */
function buildYtDlpArgs(config: DownloadConfig, outputPath: string): string[] {
    const formatString = buildFormatString(config);

    const args: string[] = [
        config.url,
        '--extractor-args', 'youtube:client=android',
        '--download-sections', `*${config.start}-${config.end}`,
        '--force-keyframes-at-cuts',
        '-f', formatString,
        '--merge-output-format', 'mp4',
        '-o', outputPath,
        '--no-playlist'
        // NOTE: ffmpeg is a system requirement
        // Install via: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)
    ];

    return args;
}

export {
    buildYtDlpArgs,
    buildFormatString
};
