import { FC } from 'hono/jsx';

export const Layout: FC<{ title: string; children?: any }> = ({ title, children }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    
                    .container {
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        max-width: 600px;
                        width: 100%;
                        padding: 40px;
                    }
                    
                    h1 {
                        color: #333;
                        margin-bottom: 10px;
                        font-size: 28px;
                    }
                    
                    .subtitle {
                        color: #666;
                        margin-bottom: 30px;
                        font-size: 14px;
                    }
                    
                    .form-group {
                        margin-bottom: 20px;
                    }
                    
                    label {
                        display: block;
                        color: #333;
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    
                    input[type="text"],
                    input[type="url"],
                    select {
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #e1e8ed;
                        border-radius: 8px;
                        font-size: 14px;
                        transition: border-color 0.3s;
                    }
                    
                    input[type="text"]:focus,
                    input[type="url"]:focus,
                    select:focus {
                        outline: none;
                        border-color: #667eea;
                    }
                    
                    .time-inputs {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }
                    
                    .radio-group {
                        display: flex;
                        gap: 20px;
                        margin-top: 8px;
                    }
                    
                    .radio-label {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        font-weight: normal;
                    }
                    
                    input[type="radio"] {
                        margin-right: 6px;
                        cursor: pointer;
                    }
                    
                    button {
                        width: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s, box-shadow 0.2s;
                        margin-top: 10px;
                    }
                    
                    button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
                    }
                    
                    button:active {
                        transform: translateY(0);
                    }
                    
                    button:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                        transform: none;
                    }
                    
                    .result {
                        margin-top: 20px;
                        padding: 25px;
                        border-radius: 12px;
                        display: none;
                        text-align: center;
                    }
                    
                    .result.error {
                        background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
                        border: 2px solid #dc3545;
                        color: #721c24;
                        display: block;
                    }
                    
                    .error-icon {
                        font-size: 48px;
                        margin-bottom: 15px;
                    }
                    
                    .error-title {
                        font-size: 20px;
                        font-weight: 700;
                        margin-bottom: 10px;
                        color: #721c24;
                    }
                    
                    .error-message {
                        font-size: 14px;
                        color: #721c24;
                    }
                    
                    .loading {
                        display: none;
                        text-align: center;
                        margin-top: 20px;
                        color: #667eea;
                        font-weight: 600;
                    }
                    
                    .loading.show {
                        display: block;
                    }
                    
                    .spinner {
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #667eea;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 20px auto;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .helper-text {
                        font-size: 12px;
                        color: #666;
                        margin-top: 4px;
                    }
                `}</style>
            </head>
            <body>
                <div class="container">
                    {children}
                </div>
            </body>
        </html>
    );
};
