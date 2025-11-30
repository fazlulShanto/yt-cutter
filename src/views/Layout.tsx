import { FC } from 'hono/jsx';

export const Layout: FC<{ title: string; children?: any }> = ({ title, children }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --primary: #6366f1;
                        --primary-hover: #4f46e5;
                        --bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                        --card-bg: rgba(255, 255, 255, 0.95);
                        --text-main: #1f2937;
                        --text-secondary: #6b7280;
                        --border-color: #e5e7eb;
                        --input-bg: #f9fafb;
                        --focus-ring: rgba(99, 102, 241, 0.2);
                    }

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        background: var(--bg-gradient);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        color: var(--text-main);
                    }
                    
                    .container {
                        background: var(--card-bg);
                        border-radius: 24px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                        max-width: 640px;
                        width: 100%;
                        padding: 48px;
                        backdrop-filter: blur(20px);
                    }
                    
                    h1 {
                        color: var(--text-main);
                        margin-bottom: 12px;
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: -0.02em;
                    }
                    
                    .subtitle {
                        color: var(--text-secondary);
                        margin-bottom: 40px;
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    
                    .form-group {
                        margin-bottom: 24px;
                        width: 100%;
                    }
                    
                    label {
                        display: block;
                        color: var(--text-main);
                        font-weight: 600;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }
                    
                    input[type="text"],
                    input[type="url"],
                    select {
                        width: 100%;
                        padding: 14px 16px;
                        background: var(--input-bg);
                        border: 2px solid transparent;
                        border-radius: 12px;
                        font-size: 15px;
                        color: var(--text-main);
                        transition: all 0.2s ease;
                        font-family: inherit;
                    }
                    
                    input[type="text"]:hover,
                    input[type="url"]:hover,
                    select:hover {
                        background: #fff;
                        border-color: var(--border-color);
                    }
                    
                    input[type="text"]:focus,
                    input[type="url"]:focus,
                    select:focus {
                        outline: none;
                        background: #fff;
                        border-color: var(--primary);
                        box-shadow: 0 0 0 4px var(--focus-ring);
                    }
                    
                    .time-inputs {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                    }
                    
                    .radio-group {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 12px;
                        margin-top: 8px;
                    }
                    
                    .radio-label {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-weight: 500;
                        font-size: 14px;
                        padding: 12px;
                        border-radius: 12px;
                        border: 2px solid var(--border-color);
                        background: #fff;
                        transition: all 0.2s ease;
                        text-align: center;
                    }

                    .radio-label:hover {
                        border-color: var(--primary);
                        background: var(--input-bg);
                    }
                    
                    .radio-label input[type="radio"] {
                        display: none;
                    }

                    .radio-label:has(input:checked) {
                        border-color: var(--primary);
                        background: rgba(99, 102, 241, 0.05);
                        color: var(--primary);
                    }
                    
                    button {
                        width: 100%;
                        background: var(--primary);
                        color: white;
                        border: none;
                        padding: 16px;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-top: 16px;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                    }
                    
                    button:hover {
                        background: var(--primary-hover);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
                    }
                    
                    button:active {
                        transform: translateY(0);
                    }
                    
                    button:disabled {
                        opacity: 0.7;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }
                    
                    .result {
                        margin-top: 24px;
                        padding: 24px;
                        border-radius: 16px;
                        display: none;
                        text-align: center;
                        animation: slideDown 0.3s ease;
                    }
                    
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .result.error {
                        background: #fef2f2;
                        border: 1px solid #fee2e2;
                        color: #991b1b;
                    }
                    
                    .error-icon {
                        font-size: 32px;
                        margin-bottom: 12px;
                    }
                    
                    .error-title {
                        font-size: 18px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #991b1b;
                    }
                    
                    .error-message {
                        font-size: 14px;
                        color: #b91c1c;
                    }
                    
                    .loading {
                        display: none;
                        text-align: center;
                        margin-top: 24px;
                        color: var(--primary);
                        font-weight: 500;
                    }
                    
                    .loading.show {
                        display: block;
                    }
                    
                    .spinner {
                        border: 3px solid rgba(99, 102, 241, 0.1);
                        border-top: 3px solid var(--primary);
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 16px;
                    }
                    
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    .helper-text {
                        font-size: 13px;
                        color: var(--text-secondary);
                        margin-top: 6px;
                    }
                `
                }} />
            </head>
            <body>
                <div class="container">
                    {children}
                </div>
            </body>
        </html >
    );
};
