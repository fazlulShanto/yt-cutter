import { FC } from 'hono/jsx';
import { Layout } from './Layout';

interface SuccessPageProps {
    downloadUrl: string;
    fileSize: string;
    format: string;
}

export const SuccessPage: FC<SuccessPageProps> = ({ downloadUrl, fileSize, format }) => {
    const fileSizeMB = (parseInt(fileSize) / 1024 / 1024).toFixed(2);

    return (
        <Layout title="Success - YouTube Video Cutter">
            <style dangerouslySetInnerHTML={{
                __html: `
                .success-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    animation: bounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-align: center;
                }
                
                @keyframes bounce {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                h1 {
                    text-align: center;
                    color: #059669; /* emerald-600 */
                }
                
                .subtitle {
                    text-align: center;
                    margin-bottom: 32px;
                }
                
                .details-card {
                    background: #f3f4f6;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 32px;
                    border: 1px solid #e5e7eb;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #4b5563;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .detail-value {
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .download-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #059669; /* emerald-600 */
                    color: white;
                    text-decoration: none;
                    padding: 16px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    margin-bottom: 16px;
                    width: 100%;
                    box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
                }
                
                .download-btn:hover {
                    background: #047857; /* emerald-700 */
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(5, 150, 105, 0.4);
                }
                
                .download-btn:active {
                    transform: translateY(0);
                }
                
                .back-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    color: #6366f1; /* indigo-500 */
                    text-decoration: none;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    border: 2px solid rgba(99, 102, 241, 0.2);
                    transition: all 0.2s;
                    width: 100%;
                }
                
                .back-btn:hover {
                    background: rgba(99, 102, 241, 0.05);
                    border-color: #6366f1;
                }
                
                .note {
                    font-size: 13px;
                    color: #9ca3af;
                    margin-top: 24px;
                    text-align: center;
                }
                
                .buttons {
                    display: flex;
                    flex-direction: column;
                }
            `
            }} />

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
                    <span>⬇️</span> Download Your Video
                </a>
                <a href="/" class="back-btn">
                    ← Cut Another Video
                </a>
            </div>

            <p class="note">Download link opens in a new tab. Link expires after some time.</p>
        </Layout >
    );
};
