import fs from 'fs';
import FormData from 'form-data';
import axios, { AxiosError } from 'axios';

interface TmpFilesResponse {
    status: string;
    data: {
        url: string;
    };
}

/**
 * Upload file to tmpfiles.org
 * @param filePath - Path to file to upload
 * @returns Download URL from tmpfiles.org
 */
async function uploadToTmpFiles(filePath: string): Promise<string> {
    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const response = await axios.post<TmpFilesResponse>(
            'https://tmpfiles.org/api/v1/upload',
            form,
            {
                headers: {
                    ...form.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        if (response.data && response.data.data && response.data.data.url) {
            // The API returns a URL like: https://tmpfiles.org/12345/filename
            // We need to modify it to the direct download URL: https://tmpfiles.org/dl/12345/filename
            const originalUrl = response.data.data.url;
            const downloadUrl = originalUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            return downloadUrl;
        }

        throw new Error('Invalid response from tmpfiles.org');
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Upload error:', axiosError.message);
        if (axiosError.response) {
            console.error('Response status:', axiosError.response.status);
            console.error('Response data:', JSON.stringify(axiosError.response.data));
        }
        throw new Error(`Failed to upload file: ${axiosError.message}`);
    }
}

export {
    uploadToTmpFiles
};
