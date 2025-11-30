#!/bin/bash

# Script to download yt-dlp binary for local development

set -e

# Detect platform
OS=$(uname -s)
ARCH=$(uname -m)

if [ "$OS" = "Darwin" ] && [ "$ARCH" = "arm64" ]; then
    PLATFORM="mac_arm"
elif [ "$OS" = "Linux" ]; then
    PLATFORM="linux"
else
    echo "Unsupported platform: $OS $ARCH"
    exit 1
fi

BIN_DIR="bin/$PLATFORM"
YT_DLP_PATH="$BIN_DIR/yt-dlp"

# Create bin directory
mkdir -p "$BIN_DIR"

# Download yt-dlp
echo "Downloading yt-dlp for $PLATFORM..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o "$YT_DLP_PATH"

# Make executable
chmod +x "$YT_DLP_PATH"

echo "✓ yt-dlp downloaded successfully to $YT_DLP_PATH"
echo "✓ Version: $($YT_DLP_PATH --version)"
