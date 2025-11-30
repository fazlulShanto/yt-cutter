import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { jsxRenderer } from "hono/jsx-renderer";
import YtDlpWrap from "yt-dlp-wrap";
import fs from "fs";
import path from "path";
import { connectDB } from "./db/connection";
import { getBinaryPaths, verifyBinaries } from "./utils/platform";
import { validateConfig } from "./utils/config";
import { buildYtDlpArgs } from "./utils/ytdlp-builder";
import { uploadToTmpFiles } from "./services/uploader";
import {
    validateApiKey,
    checkQuota,
    incrementUsage,
    decrementUsage,
} from "./middleware/auth";
import adminRoutes from "./routes/admin";
import { ApiResponse, QueryParams } from "./types";
import { HomePage } from "./views/HomePage";
import { SuccessPage } from "./views/SuccessPage";
import { AdminPage } from "./views/AdminPage";

const app = new Hono();
const port = 3000;

// Enable CORS
app.use("/*", cors());

// Get binary paths
const { ytDlpPath } = getBinaryPaths();
const ytDlpWrap = new YtDlpWrap(ytDlpPath);

// Create out_dir if it doesn't exist
const outDir = path.join(__dirname, "..", "out_dir");
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Admin UI - accessible at /admin/ui
app.get("/admin/ui", (c) => {
    return c.html(<AdminPage />);
});

// Mount admin API routes at /admin/*
app.route("/admin", adminRoutes);

// Home page UI
app.get("/", (c) => {
    return c.html(<HomePage />);
});

// Success page
app.get("/success", (c) => {
    const downloadUrl = c.req.query('downloadUrl') || '';
    const fileSize = c.req.query('fileSize') || '0';
    const format = c.req.query('format') || 'mp4';

    if (!downloadUrl) {
        return c.redirect('/');
    }

    return c.html(<SuccessPage downloadUrl={downloadUrl} fileSize={fileSize} format={format} />);
});

// Health check endpoint for Docker
app.get("/health", (c) => {
    return c.json({ status: "ok" });
});

// Download endpoint - requires API key and quota check
app.get("/download", validateApiKey, checkQuota, async (c) => {
    let outputPath: string | null = null;
    const apiKeyDoc = c.get("apiKeyDoc");
    const apiKey = apiKeyDoc?.key;

    try {
        // Increment usage counter
        if (apiKey) {
            await incrementUsage(apiKey);
        }

        // Get query parameters
        const query = c.req.query() as QueryParams;

        // Validate configuration
        const config = validateConfig(query);

        console.log(
            `Request to download ${config.url} from ${config.start} to ${config.end}`
        );
        console.log(
            `Config: type=${config.type}, videoRes=${config.videoRes}, audioRes=${config.audioRes}, format=${config.format}`
        );
        console.log(
            `API Key: ${apiKeyDoc?.name} (${apiKeyDoc?.currentUsage + 1}/${apiKeyDoc?.maxConcurrent
            })`
        );

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `video_${timestamp}.mp4`;
        outputPath = path.join(outDir, filename);

        // Build yt-dlp arguments
        const args = buildYtDlpArgs(config, outputPath);

        console.log("Downloading and cutting video with yt-dlp...");
        console.log("Args:", args.join(" "));

        // Execute yt-dlp and wait for completion
        await new Promise<void>((resolve, reject) => {
            const ytDlpProcess = ytDlpWrap.exec(args);

            ytDlpProcess.on(
                "ytDlpEvent",
                (eventType: string, eventData: string) => {
                    console.log(eventType, eventData);
                }
            );

            ytDlpProcess.on("error", (error: Error) => {
                console.error("yt-dlp process error:", error);
                reject(error);
            });

            ytDlpProcess.on("close", (code: number | null) => {
                if (code === 0) {
                    console.log("yt-dlp completed successfully");
                    resolve();
                } else {
                    reject(new Error(`yt-dlp exited with code ${code}`));
                }
            });
        });

        // Check if file was created
        if (!fs.existsSync(outputPath)) {
            throw new Error("Downloaded file not found");
        }

        const fileStats = fs.statSync(outputPath);
        console.log(`File saved: ${outputPath} (${fileStats.size} bytes)`);

        // Upload to tmpfiles.org
        console.log("Uploading to tmpfiles.org...");
        const downloadUrl = await uploadToTmpFiles(outputPath);
        console.log(`Upload successful: ${downloadUrl}`);

        // Clean up local file after upload
        fs.unlinkSync(outputPath);
        console.log(`Cleaned up local file: ${outputPath}`);

        // Decrement usage counter
        if (apiKey) {
            await decrementUsage(apiKey);
        }

        // Return JSON response with download URL
        const response: ApiResponse = {
            success: true,
            downloadUrl: downloadUrl,
            fileSize: fileStats.size,
            format: config.format,
        };

        return c.json(response);
    } catch (error) {
        console.error("Server error:", error);

        // Decrement usage counter on error
        if (apiKey) {
            await decrementUsage(apiKey);
        }

        // Clean up file on error
        if (outputPath && fs.existsSync(outputPath)) {
            try {
                fs.unlinkSync(outputPath);
                console.log(`Cleaned up file after error: ${outputPath}`);
            } catch (cleanupError) {
                console.error("Error cleaning up file:", cleanupError);
            }
        }

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        const errorResponse: ApiResponse = {
            success: false,
            error: errorMessage,
        };

        return c.json(errorResponse, 500);
    }
});

// Verify binaries, connect to MongoDB, and start server
async function startServer() {
    try {
        verifyBinaries();
        await connectDB();

        serve(
            {
                fetch: app.fetch,
                port,
            },
            (info) => {
                console.log(`Server running at http://localhost:${info.port}`);
            }
        );
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
