const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

/**
 * Upload file to tmpfiles.org
 * @param {string} filePath - Path to file to upload
 * @returns {Promise<string>} Download URL from tmpfiles.org
 */
async function uploadToTmpFiles(filePath) {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
            headers: {
                ...form.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data && response.data.data && response.data.data.url) {
            // The API returns a URL like: https://tmpfiles.org/12345/filename
            // We need to modify it to the direct download URL: https://tmpfiles.org/dl/12345/filename
            const originalUrl = response.data.data.url;
            const downloadUrl = originalUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            return downloadUrl;
        }

        throw new Error('Invalid response from tmpfiles.org');
    } catch (error) {
        console.error('Upload error:', error.message);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
}

module.exports = {
    uploadToTmpFiles
};
