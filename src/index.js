const express = require('express');
const cors = require('cors');
const YtDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');
const { getBinaryPaths, verifyBinaries } = require('./utils/platform');
const { validateConfig } = require('./utils/config');
const { buildYtDlpArgs } = require('./utils/ytdlp-builder');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Get binary paths
const { ytDlpPath } = getBinaryPaths();
const ytDlpWrap = new YtDlpWrap(ytDlpPath);

// Create out_dir if it doesn't exist
const outDir = path.join(__dirname, '..', 'out_dir');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

app.get('/download', async (req, res) => {
    try {
        // Validate configuration
        const config = validateConfig(req.query);

        console.log(`Request to download ${config.url} from ${config.start} to ${config.end}`);
        console.log(`Config: type=${config.type}, videoRes=${config.videoRes}, audioRes=${config.audioRes}, format=${config.format}`);

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `video_${timestamp}.mp4`;
        const outputPath = path.join(outDir, filename);

        // Build yt-dlp arguments
        const args = buildYtDlpArgs(config, outputPath);

        console.log('Downloading and cutting video with yt-dlp...');
        console.log('Args:', args.join(' '));

        // Execute yt-dlp and wait for completion
        await new Promise((resolve, reject) => {
            const ytDlpProcess = ytDlpWrap.exec(args);

            ytDlpProcess.on('ytDlpEvent', (eventType, eventData) => {
                console.log(eventType, eventData);
            });

            ytDlpProcess.on('error', (error) => {
                console.error('yt-dlp process error:', error);
                reject(error);
            });

            ytDlpProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('yt-dlp completed successfully');
                    resolve();
                } else {
                    reject(new Error(`yt-dlp exited with code ${code}`));
                }
            });
        });

        // Check if file was created
        if (!fs.existsSync(outputPath)) {
            throw new Error('Downloaded file not found');
        }

        const fileStats = fs.statSync(outputPath);
        console.log(`File saved: ${outputPath} (${fileStats.size} bytes)`);

        // Return JSON response with file path
        res.json({
            success: true,
            filePath: outputPath,
            fileName: filename,
            fileSize: fileStats.size,
            format: config.format
        });

    } catch (error) {
        console.error('Server error:', error);

        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
});

app.listen(port, () => {
    verifyBinaries();
    console.log(`Server running at http://localhost:${port}`);
});
