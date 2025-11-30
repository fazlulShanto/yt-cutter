import express, { Request, Response } from 'express';
import cors from 'cors';
import YtDlpWrap from 'yt-dlp-wrap';
import fs from 'fs';
import path from 'path';
import { getBinaryPaths, verifyBinaries } from './utils/platform';
import { validateConfig } from './utils/config';
import { buildYtDlpArgs } from './utils/ytdlp-builder';
import { uploadToTmpFiles } from './services/uploader';
import { ApiResponse, QueryParams } from './types';

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

// Health check endpoint for Docker
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/download', async (req: Request<{}, {}, {}, QueryParams>, res: Response<ApiResponse>) => {
    let outputPath: string | null = null;

    try {
        // Validate configuration
        const config = validateConfig(req.query);
        
        console.log(`Request to download ${config.url} from ${config.start} to ${config.end}`);
        console.log(`Config: type=${config.type}, videoRes=${config.videoRes}, audioRes=${config.audioRes}, format=${config.format}`);

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `video_${timestamp}.mp4`;
        outputPath = path.join(outDir, filename);

        // Build yt-dlp arguments
        const args = buildYtDlpArgs(config, outputPath);

        console.log('Downloading and cutting video with yt-dlp...');
        console.log('Args:', args.join(' '));

        // Execute yt-dlp and wait for completion
        await new Promise<void>((resolve, reject) => {
            const ytDlpProcess = ytDlpWrap.exec(args);

            ytDlpProcess.on('ytDlpEvent', (eventType: string, eventData: string) => {
                console.log(eventType, eventData);
            });

            ytDlpProcess.on('error', (error: Error) => {
                console.error('yt-dlp process error:', error);
                reject(error);
            });

            ytDlpProcess.on('close', (code: number | null) => {
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

        // Upload to tmpfiles.org
        console.log('Uploading to tmpfiles.org...');
        const downloadUrl = await uploadToTmpFiles(outputPath);
        console.log(`Upload successful: ${downloadUrl}`);

        // Clean up local file after upload
        fs.unlinkSync(outputPath);
        console.log(`Cleaned up local file: ${outputPath}`);

        // Return JSON response with download URL
        res.json({
            success: true,
            downloadUrl: downloadUrl,
            fileSize: fileStats.size,
            format: config.format
        });

    } catch (error) {
        console.error('Server error:', error);
        
        // Clean up file on error
        if (outputPath && fs.existsSync(outputPath)) {
            try {
                fs.unlinkSync(outputPath);
                console.log(`Cleaned up file after error: ${outputPath}`);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        
        if (!res.headersSent) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: errorMessage
            });
        }
    }
});

app.listen(port, () => {
    verifyBinaries();
    console.log(`Server running at http://localhost:${port}`);
});
