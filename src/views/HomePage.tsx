import { FC } from 'hono/jsx';
import { Layout } from './Layout';

export const HomePage: FC = () => {
    return (
        <Layout title="YouTube Video Cutter">
            <h1>🎬 YouTube Video Cutter</h1>
            <p class="subtitle">Download and cut YouTube videos with custom time ranges</p>
            
            <form id="downloadForm">
                <div class="form-group">
                    <label for="apiKey">API Key *</label>
                    <input 
                        type="text" 
                        id="apiKey" 
                        name="apiKey" 
                        required 
                        placeholder="Enter your API key"
                    />
                    <div class="helper-text">Your API key is required to authenticate requests</div>
                </div>

                <div class="form-group">
                    <label for="url">YouTube URL *</label>
                    <input 
                        type="url" 
                        id="url" 
                        name="url" 
                        required 
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                <div class="form-group">
                    <label>Time Range</label>
                    <div class="time-inputs">
                        <div>
                            <input 
                                type="text" 
                                id="start" 
                                name="start" 
                                placeholder="Start (e.g., 00:00:10)"
                                required
                            />
                            <div class="helper-text">Format: HH:MM:SS or MM:SS</div>
                        </div>
                        <div>
                            <input 
                                type="text" 
                                id="end" 
                                name="end" 
                                placeholder="End (e.g., 00:01:30)"
                                required
                            />
                            <div class="helper-text">Format: HH:MM:SS or MM:SS</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Download Type *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="type" value="video+audio" checked />
                            Video + Audio
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="type" value="video" />
                            Video Only
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="type" value="audio" />
                            Audio Only
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="videoRes">Video Resolution</label>
                    <select id="videoRes" name="videoRes">
                        <option value="720">720p (HD)</option>
                        <option value="480" selected>480p (SD)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="audioRes">Audio Quality</label>
                    <select id="audioRes" name="audioRes">
                        <option value="128">128 kbps (High)</option>
                        <option value="96" selected>96 kbps (Standard)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="format">Output Format</label>
                    <select id="format" name="format">
                        <option value="mp4" selected>MP4</option>
                        <option value="wav">WAV (Audio only)</option>
                    </select>
                </div>

                <button type="submit">Download & Cut Video</button>
            </form>

            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Processing your request... This may take a few moments.</p>
            </div>

            <div class="result" id="result"></div>

            <script dangerouslySetInnerHTML={{
                __html: `
                    document.getElementById('downloadForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        
                        const form = e.target;
                        const formData = new FormData(form);
                        const apiKey = formData.get('apiKey');
                        
                        // Build query parameters
                        const params = new URLSearchParams();
                        params.append('url', formData.get('url'));
                        params.append('start', formData.get('start'));
                        params.append('end', formData.get('end'));
                        params.append('type', formData.get('type'));
                        params.append('videoRes', formData.get('videoRes'));
                        params.append('audioRes', formData.get('audioRes'));
                        params.append('format', formData.get('format'));
                        
                        const loading = document.getElementById('loading');
                        const result = document.getElementById('result');
                        const submitButton = form.querySelector('button[type="submit"]');
                        
                        // Show loading state
                        loading.classList.add('show');
                        result.className = 'result'; // Reset classes to hide
                        submitButton.disabled = true;
                        
                        try {
                            const response = await fetch('/download?' + params.toString(), {
                                method: 'GET',
                                headers: {
                                    'X-API-Key': apiKey
                                }
                            });
                            
                            const data = await response.json();
                            
                            loading.classList.remove('show');
                            submitButton.disabled = false;
                            
                            if (data.success) {
                                // Redirect to success page with query params
                                const successParams = new URLSearchParams();
                                successParams.append('downloadUrl', data.downloadUrl);
                                successParams.append('fileSize', data.fileSize.toString());
                                successParams.append('format', data.format);
                                window.location.href = '/success?' + successParams.toString();
                            } else {
                                result.className = 'result error';
                                result.innerHTML = \`
                                    <div class="error-icon">❌</div>
                                    <div class="error-title">Error</div>
                                    <div class="error-message">\${data.error || 'An unknown error occurred'}</div>
                                \`;
                            }
                        } catch (error) {
                            loading.classList.remove('show');
                            submitButton.disabled = false;
                            result.className = 'result error';
                            result.innerHTML = \`
                                <div class="error-icon">❌</div>
                                <div class="error-title">Network Error</div>
                                <div class="error-message">Failed to connect to the server. Please try again.</div>
                            \`;
                        }
                    });
                `
            }} />
        </Layout>
    );
};
