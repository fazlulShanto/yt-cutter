# YT-Cutter API

A modular Express API built with TypeScript for downloading and cutting YouTube videos with configurable quality settings.

## System Requirements

- **Node.js** 18+ 
- **deno** (required)
- **ffmpeg** (required)
- **pnpm** (package manager)

### Installing ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Linux (CentOS/RHEL):**
```bash
sudo yum install ffmpeg
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Download yt-dlp binary for your platform:
   ```bash
   ./scripts/download-yt-dlp.sh
   ```
   
   This will automatically detect your platform and download the latest yt-dlp binary.

> [!NOTE]
> For Docker deployment, yt-dlp is automatically downloaded during the image build process.

## Running the Server

### Local Development

```bash
pnpm dev
```

Server will start on `http://localhost:3000`

### Docker

**Build and run with Docker Compose:**
```bash
docker-compose up -d
```

**Build manually:**
```bash
docker build -t yt-cutter .
docker run -p 3000:3000 yt-cutter
```

**Stop the container:**
```bash
docker-compose down
```

## API Usage

### Endpoint

`GET /download`

### Query Parameters

| Parameter | Type | Options | Default | Description |
|-----------|------|---------|---------|-------------|
| `url` | string | - | *required* | YouTube video URL |
| `start` | string | HH:MM:SS | *required* | Start time |
| `end` | string | HH:MM:SS | *required* | End time |
| `type` | string | `video+audio`, `video`, `audio` | `video+audio` | Content type |
| `videoRes` | string | `480`, `720` | `720` | Video resolution |
| `audioRes` | string | `96`, `128` | `128` | Audio bitrate (kbps) |
| `format` | string | `mp4`, `wav` | `mp4` | Output format |

### Examples

**Basic download (720p video + 128k audio):**
```bash
curl "http://localhost:3000/download?url=https://www.youtube.com/watch?v=VIDEO_ID&start=00:00:10&end=00:00:20"
```

**480p video with 96k audio:**
```bash
curl "http://localhost:3000/download?url=https://www.youtube.com/watch?v=VIDEO_ID&start=00:00:10&end=00:00:20&videoRes=480&audioRes=96"
```

**Video-only download:**
```bash
curl "http://localhost:3000/download?url=https://www.youtube.com/watch?v=VIDEO_ID&start=00:00:10&end=00:00:20&type=video"
```

**Audio-only download (WAV format):**
```bash
curl "http://localhost:3000/download?url=https://www.youtube.com/watch?v=VIDEO_ID&start=00:00:10&end=00:00:20&type=audio&format=wav"
```

### Response Format

```json
{
  "success": true,
  "filePath": "/path/to/out_dir/video_1764477060617.mp4",
  "fileName": "video_1764477060617.mp4",
  "fileSize": 563541,
  "format": "mp4"
}
```

## Project Structure

```
yt-cutter/
├── bin/
│   ├── mac_arm/
│   │   └── yt-dlp
│   └── linux/
│       └── yt-dlp
├── src/
│   ├── index.js              # Main Express application
│   ├── utils/
│   │   ├── platform.js       # Platform detection
│   │   ├── config.js         # Request validation
│   │   └── ytdlp-builder.js  # yt-dlp argument builder
│   └── services/
│       └── uploader.js       # File upload service
├── out_dir/                  # Downloaded files
└── test/
    └── test-api.js           # API test script
```

## Testing

Run the test script:
```bash
pnpm test
```

Or manually:
```bash
node test/test-api.js
```

## Notes

- Downloaded files are saved to `out_dir/` with timestamp-based filenames
- The API uses yt-dlp's `--download-sections` feature for efficient cutting
- Only the specified time range is downloaded (not the full video)
- ffmpeg must be installed and available in system PATH
