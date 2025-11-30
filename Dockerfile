# Use Node.js LTS with Alpine for smaller image size
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache \
    ffmpeg \
    deno \
    python3 \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@10.12.1 && \
    pnpm install --frozen-lockfile

# Copy application source
COPY . .

# Download yt-dlp binary for Linux
RUN mkdir -p /app/bin/linux && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /app/bin/linux/yt-dlp && \
    chmod +x /app/bin/linux/yt-dlp

# Create output directory
RUN mkdir -p /app/out_dir

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["pnpm", "dev"]
