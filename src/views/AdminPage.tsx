import { FC } from 'hono/jsx';

export const AdminPage: FC = () => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Admin - API Key Management</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    `
                }} />
            </head>
            <body class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
                <div class="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <div class="text-center mb-12">
                        <h1 class="text-4xl font-bold text-slate-900 mb-2">
                            🔑 Admin Panel
                        </h1>
                        <p class="text-slate-600">Manage API keys and monitor usage</p>
                    </div>

                    {/* Authentication Section */}
                    <div id="authSection" class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <h2 class="text-xl font-semibold text-slate-900 mb-6">Authentication</h2>
                        <div class="space-y-4">
                            <div>
                                <label for="adminKey" class="block text-sm font-medium text-slate-700 mb-2">
                                    Admin Key *
                                </label>
                                <input
                                    type="password"
                                    id="adminKey"
                                    placeholder="Enter your admin key"
                                    autocomplete="off"
                                    class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                <p class="mt-2 text-sm text-slate-500">Required to access admin functions</p>
                            </div>
                            <button
                                id="authButton"
                                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                            >
                                Authenticate
                            </button>
                        </div>
                    </div>

                    {/* Alert Messages */}
                    <div id="errorAlert" class="hidden max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"></div>
                    <div id="successAlert" class="hidden max-w-4xl mx-auto mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"></div>

                    {/* Dashboard */}
                    <div id="dashboard" class="hidden">
                        {/* Dashboard Header */}
                        <div class="flex justify-between items-center mb-6 max-w-6xl mx-auto">
                            <h2 class="text-2xl font-bold text-slate-900">API Keys</h2>
                            <button
                                id="createKeyBtn"
                                class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <span>+</span> Create New Key
                            </button>
                        </div>

                        {/* Table Container */}
                        <div id="tableContainer" class="bg-white rounded-2xl shadow-lg overflow-hidden max-w-6xl mx-auto">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">API Key</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Usage</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Last Used</th>
                                            <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="apiKeysTableBody" class="divide-y divide-slate-200">
                                        {/* API keys will be loaded here */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Create/Edit Modal */}
                    <div id="keyModal" class="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
                            <h3 id="modalTitle" class="text-2xl font-bold text-slate-900 mb-2">Create API Key</h3>
                            <p id="modalSubtitle" class="text-slate-600 mb-6">Generate a new API key for your application</p>

                            <div class="space-y-4">
                                <div>
                                    <label for="keyName" class="block text-sm font-medium text-slate-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="keyName"
                                        placeholder="e.g., Production App"
                                        required
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    />
                                    <p class="mt-1 text-sm text-slate-500">A descriptive name for this API key</p>
                                </div>

                                <div>
                                    <label for="maxConcurrent" class="block text-sm font-medium text-slate-700 mb-2">
                                        Max Concurrent Requests *
                                    </label>
                                    <input
                                        type="number"
                                        id="maxConcurrent"
                                        value="2"
                                        min="1"
                                        max="100"
                                        required
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    />
                                    <p class="mt-1 text-sm text-slate-500">Maximum number of simultaneous requests</p>
                                </div>

                                <div class="flex gap-3 pt-4">
                                    <button
                                        id="cancelBtn"
                                        class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        id="saveKeyBtn"
                                        class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                    >
                                        Create Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    <div id="deleteModal" class="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
                            <h3 class="text-2xl font-bold text-slate-900 mb-2">Delete API Key</h3>
                            <p class="text-slate-600 mb-6">This action cannot be undone</p>

                            <p class="text-slate-700 mb-6">
                                Are you sure you want to delete the API key "<strong id="deleteKeyName" class="text-slate-900"></strong>"?
                                This will immediately revoke access for any applications using this key.
                            </p>

                            <div class="flex gap-3">
                                <button
                                    id="cancelDeleteBtn"
                                    class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="confirmDeleteBtn"
                                    class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                >
                                    Delete Key
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reset Quota Confirmation Modal */}
                    <div id="resetModal" class="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
                            <h3 class="text-2xl font-bold text-slate-900 mb-2">Reset Quota</h3>
                            <p class="text-slate-600 mb-6">Reset current usage to zero</p>

                            <p class="text-slate-700 mb-6">
                                Are you sure you want to reset the quota for "<strong id="resetKeyName" class="text-slate-900"></strong>"?
                                This will set the current usage to 0.
                            </p>

                            <div class="flex gap-3">
                                <button
                                    id="cancelResetBtn"
                                    class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    id="confirmResetBtn"
                                    class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200"
                                >
                                    Reset Quota
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <script dangerouslySetInnerHTML={{
                    __html: `
                    let adminKey = '';
                    let editingKeyId = null;
                    let deletingKeyId = null;
                    let resettingKeyId = null;

                    // DOM Elements
                    const authSection = document.getElementById('authSection');
                    const dashboard = document.getElementById('dashboard');
                    const authButton = document.getElementById('authButton');
                    const adminKeyInput = document.getElementById('adminKey');
                    const apiKeysTableBody = document.getElementById('apiKeysTableBody');
                    const tableContainer = document.getElementById('tableContainer');
                    const createKeyBtn = document.getElementById('createKeyBtn');
                    const keyModal = document.getElementById('keyModal');
                    const deleteModal = document.getElementById('deleteModal');
                    const resetModal = document.getElementById('resetModal');
                    const errorAlert = document.getElementById('errorAlert');
                    const successAlert = document.getElementById('successAlert');

                    // Show error message
                    function showError(message) {
                        errorAlert.textContent = message;
                        errorAlert.classList.remove('hidden');
                        successAlert.classList.add('hidden');
                        setTimeout(() => errorAlert.classList.add('hidden'), 5000);
                    }

                    // Show success message
                    function showSuccess(message) {
                        successAlert.textContent = message;
                        successAlert.classList.remove('hidden');
                        errorAlert.classList.add('hidden');
                        setTimeout(() => successAlert.classList.add('hidden'), 5000);
                    }

                    // Authenticate admin
                    authButton.addEventListener('click', async () => {
                        const key = adminKeyInput.value.trim();
                        if (!key) {
                            showError('Please enter admin key');
                            return;
                        }

                        try {
                            const response = await fetch('/admin/api-keys', {
                                headers: { 'X-Admin-Key': key }
                            });

                            if (response.ok) {
                                adminKey = key;
                                authSection.classList.add('hidden');
                                dashboard.classList.remove('hidden');
                                loadApiKeys();
                            } else {
                                showError('Invalid admin key');
                            }
                        } catch (error) {
                            showError('Failed to authenticate');
                        }
                    });

                    // Load API keys
                    async function loadApiKeys() {
                        try {
                            const response = await fetch('/admin/api-keys', {
                                headers: { 'X-Admin-Key': adminKey }
                            });

                            const data = await response.json();
                            
                            if (data.success && data.data) {
                                renderApiKeys(data.data);
                            } else {
                                showError(data.error || 'Failed to load API keys');
                            }
                        } catch (error) {
                            showError('Failed to load API keys');
                        }
                    }

                    // Render API keys as table rows
                    function renderApiKeys(keys) {
                        if (keys.length === 0) {
                            tableContainer.innerHTML = \`
                                <div class="text-center py-16">
                                    <div class="text-6xl mb-4 opacity-50">🔑</div>
                                    <h3 class="text-xl font-semibold text-slate-900 mb-2">No API Keys Yet</h3>
                                    <p class="text-slate-600">Create your first API key to get started</p>
                                </div>
                            \`;
                            return;
                        }

                        apiKeysTableBody.innerHTML = keys.map(key => {
                            const usagePercent = (key.currentUsage / key.maxConcurrent) * 100;
                            let usageColor = 'text-slate-900';
                            if (usagePercent >= 100) usageColor = 'text-red-600 font-semibold';
                            else if (usagePercent >= 75) usageColor = 'text-amber-600 font-semibold';

                            const statusBadge = key.currentUsage > 0
                                ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>'
                                : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">Idle</span>';

                            return \`
                                <tr class="hover:bg-slate-50 transition">
                                    <td class="px-6 py-4">
                                        <div class="font-semibold text-slate-900">\${key.name}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-2">
                                            <code class="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded font-mono max-w-[200px] truncate" title="\${key.key}">\${key.key}</code>
                                            <button onclick="copyToClipboard('\${key.key}', this)" class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition font-medium">
                                                Copy
                                            </button>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        \${statusBadge}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="\${usageColor}">\${key.currentUsage} / \${key.maxConcurrent}</span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">
                                        \${new Date(key.createdAt).toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">
                                        \${key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex gap-2">
                                            <button onclick="resetQuota('\${key.id}', '\${key.name}')" class="text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded transition font-medium" title="Reset quota">
                                                Reset
                                            </button>
                                            <button onclick="editKey('\${key.id}', '\${key.name}', \${key.maxConcurrent})" class="text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded transition font-medium">
                                                Edit
                                            </button>
                                            <button onclick="deleteKey('\${key.id}', '\${key.name}')" class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition font-medium">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            \`;
                        }).join('');
                    }

                    // Copy to clipboard
                    window.copyToClipboard = async (text, button) => {
                        try {
                            await navigator.clipboard.writeText(text);
                            const originalText = button.textContent;
                            button.textContent = 'Copied!';
                            button.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
                            button.classList.add('bg-green-600');
                            setTimeout(() => {
                                button.textContent = originalText;
                                button.classList.remove('bg-green-600');
                                button.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
                            }, 2000);
                        } catch (error) {
                            showError('Failed to copy to clipboard');
                        }
                    };

                    // Create new key
                    createKeyBtn.addEventListener('click', () => {
                        editingKeyId = null;
                        document.getElementById('modalTitle').textContent = 'Create API Key';
                        document.getElementById('modalSubtitle').textContent = 'Generate a new API key for your application';
                        document.getElementById('keyName').value = '';
                        document.getElementById('maxConcurrent').value = '2';
                        document.getElementById('saveKeyBtn').textContent = 'Create Key';
                        keyModal.classList.remove('hidden');
                    });

                    // Edit key
                    window.editKey = (id, name, maxConcurrent) => {
                        editingKeyId = id;
                        document.getElementById('modalTitle').textContent = 'Edit API Key';
                        document.getElementById('modalSubtitle').textContent = 'Update API key settings';
                        document.getElementById('keyName').value = name;
                        document.getElementById('maxConcurrent').value = maxConcurrent;
                        document.getElementById('saveKeyBtn').textContent = 'Save Changes';
                        keyModal.classList.remove('hidden');
                    };

                    // Reset quota
                    window.resetQuota = (id, name) => {
                        resettingKeyId = id;
                        document.getElementById('resetKeyName').textContent = name;
                        resetModal.classList.remove('hidden');
                    };

                    // Save key (create or update)
                    document.getElementById('saveKeyBtn').addEventListener('click', async () => {
                        const name = document.getElementById('keyName').value.trim();
                        const maxConcurrent = parseInt(document.getElementById('maxConcurrent').value);

                        if (!name) {
                            showError('Please enter a name');
                            return;
                        }

                        if (maxConcurrent < 1) {
                            showError('Max concurrent must be at least 1');
                            return;
                        }

                        try {
                            const url = editingKeyId 
                                ? \`/admin/api-keys/\${editingKeyId}\`
                                : '/admin/api-keys';
                            
                            const method = editingKeyId ? 'PATCH' : 'POST';

                            const response = await fetch(url, {
                                method,
                                headers: {
                                    'X-Admin-Key': adminKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ name, maxConcurrent })
                            });

                            const data = await response.json();

                            if (data.success) {
                                keyModal.classList.add('hidden');
                                showSuccess(editingKeyId ? 'API key updated successfully' : 'API key created successfully');
                                loadApiKeys();
                            } else {
                                showError(data.error || 'Failed to save API key');
                            }
                        } catch (error) {
                            showError('Failed to save API key');
                        }
                    });

                    // Cancel modal
                    document.getElementById('cancelBtn').addEventListener('click', () => {
                        keyModal.classList.add('hidden');
                    });

                    // Delete key
                    window.deleteKey = (id, name) => {
                        deletingKeyId = id;
                        document.getElementById('deleteKeyName').textContent = name;
                        deleteModal.classList.remove('hidden');
                    };

                    // Confirm delete
                    document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
                        try {
                            const response = await fetch(\`/admin/api-keys/\${deletingKeyId}\`, {
                                method: 'DELETE',
                                headers: { 'X-Admin-Key': adminKey }
                            });

                            const data = await response.json();

                            if (data.success) {
                                deleteModal.classList.add('hidden');
                                showSuccess('API key deleted successfully');
                                loadApiKeys();
                            } else {
                                showError(data.error || 'Failed to delete API key');
                            }
                        } catch (error) {
                            showError('Failed to delete API key');
                        }
                    });

                    // Cancel delete
                    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
                        deleteModal.classList.add('hidden');
                    });

                    // Confirm reset
                    document.getElementById('confirmResetBtn').addEventListener('click', async () => {
                        try {
                            const response = await fetch(\`/admin/api-keys/\${resettingKeyId}/reset-quota\`, {
                                method: 'POST',
                                headers: { 'X-Admin-Key': adminKey }
                            });

                            const data = await response.json();

                            if (data.success) {
                                resetModal.classList.add('hidden');
                                showSuccess('Quota reset successfully');
                                loadApiKeys();
                            } else {
                                showError(data.error || 'Failed to reset quota');
                            }
                        } catch (error) {
                            showError('Failed to reset quota');
                        }
                    });

                    // Cancel reset
                    document.getElementById('cancelResetBtn').addEventListener('click', () => {
                        resetModal.classList.add('hidden');
                    });

                    // Close modals on outside click
                    keyModal.addEventListener('click', (e) => {
                        if (e.target === keyModal) {
                            keyModal.classList.add('hidden');
                        }
                    });

                    deleteModal.addEventListener('click', (e) => {
                        if (e.target === deleteModal) {
                            deleteModal.classList.add('hidden');
                        }
                    });

                    resetModal.addEventListener('click', (e) => {
                        if (e.target === resetModal) {
                            resetModal.classList.add('hidden');
                        }
                    });

                    // Allow Enter key to authenticate
                    adminKeyInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            authButton.click();
                        }
                    });
                    `
                }} />
            </body>
        </html>
    );
};
