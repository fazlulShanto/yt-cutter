const fs = require('fs');
const path = require('path');

/**
 * Detect platform and architecture
 * @returns {string} Platform folder name (e.g., 'mac_arm', 'linux')
 */
function getPlatformFolder() {
    const platform = process.platform;
    const arch = process.arch;

    if (platform === 'darwin' && arch === 'arm64') {
        return 'mac_arm';
    } else if (platform === 'linux') {
        return 'linux';
    }
    // Add more platform mappings as needed
    throw new Error(`Unsupported platform: ${platform}_${arch}`);
}

/**
 * Get binary path for yt-dlp
 * @returns {{ytDlpPath: string, binDir: string}}
 */
function getBinaryPaths() {
    const platformFolder = getPlatformFolder();
    const binDir = path.join(__dirname, '..', '..', 'bin', platformFolder);
    const ytDlpPath = path.join(binDir, 'yt-dlp');

    return { ytDlpPath, binDir };
}

/**
 * Verify that required binaries exist
 * @throws {Error} If binaries are not found
 */
function verifyBinaries() {
    const { ytDlpPath, binDir } = getBinaryPaths();
    const platformFolder = getPlatformFolder();

    console.log(`Checking for binaries in: ${binDir}`);

    if (!fs.existsSync(ytDlpPath)) {
        throw new Error(`yt-dlp binary not found at: ${ytDlpPath}\nPlease add the binary to the bin/${platformFolder} folder.`);
    }

    console.log('✓ yt-dlp binary found');
    console.log('✓ ffmpeg is a system requirement (install via: brew install ffmpeg)');
}

module.exports = {
    getPlatformFolder,
    getBinaryPaths,
    verifyBinaries
};
