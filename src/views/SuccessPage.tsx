import { FC } from 'hono/jsx';

interface SuccessPageProps {
    downloadUrl: string;
    fileSize: string;
    format: string;
}

export const SuccessPage: FC<SuccessPageProps> = ({ downloadUrl, fileSize, format }) => {
    const fileSizeMB = (parseInt(fileSize) / 1024 / 1024).toFixed(2);
    
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Success - YouTube Video Cutter</title>
                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    
                    .container {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        max-width: 500px;
                        width: 100%;
                        padding: 50px 40px;
                        text-align: center;
                    }
                    
                    .success-icon {
                        font-size: 80px;
                        margin-bottom: 20px;
                        animation: bounce 0.6s ease-out;
                    }
                    
                    @keyframes bounce {
                        0% { transform: scale(0); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                    
                    h1 {
                        color: #155724;
                        margin-bottom: 10px;
                        font-size: 28px;
                    }
                    
                    .subtitle {
                        color: #666;
                        margin-bottom: 30px;
                        font-size: 16px;
                    }
                    
                    .details-card {
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        border-radius: 12px;
                        padding: 25px;
                        margin-bottom: 30px;
                    }
                    
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 0;
                        border-bottom: 1px solid #dee2e6;
                    }
                    
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    
                    .detail-label {
                        font-weight: 600;
                        color: #495057;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .detail-value {
                        font-weight: 500;
                        color: #212529;
                    }
                    
                    .download-btn {
                        display: inline-block;
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        color: white;
                        text-decoration: none;
                        padding: 16px 40px;
                        border-radius: 10px;
                        font-size: 18px;
                        font-weight: 600;
                        transition: transform 0.2s, box-shadow 0.2s;
                        margin-bottom: 15px;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .download-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 15px 30px rgba(40, 167, 69, 0.4);
                    }
                    
                    .download-btn:active {
                        transform: translateY(0);
                    }
                    
                    .back-btn {
                        display: inline-block;
                        background: transparent;
                        color: #667eea;
                        text-decoration: none;
                        padding: 14px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        font-weight: 600;
                        border: 2px solid #667eea;
                        transition: all 0.2s;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .back-btn:hover {
                        background: #667eea;
                        color: white;
                    }
                    
                    .note {
                        font-size: 12px;
                        color: #6c757d;
                        margin-top: 20px;
                    }
                    
                    .buttons {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }
                `}</style>
            </head>
            <body>
                <div class="container">
                    <div class="success-icon">✅</div>
                    <h1>Video Ready!</h1>
                    <p class="subtitle">Your video has been successfully trimmed and uploaded</p>
                    
                    <div class="details-card">
                        <div class="detail-row">
                            <span class="detail-label">📦 File Size</span>
                            <span class="detail-value">{fileSizeMB} MB</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">🎬 Format</span>
                            <span class="detail-value">{format.toUpperCase()}</span>
                        </div>
                    </div>
                    
                    <div class="buttons">
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer" class="download-btn">
                            ⬇️ Download Your Video
                        </a>
                        <a href="/" class="back-btn">
                            ← Cut Another Video
                        </a>
                    </div>
                    
                    <p class="note">Download link opens in a new tab. Link expires after some time.</p>
                </div>
            </body>
        </html>
    );
};
