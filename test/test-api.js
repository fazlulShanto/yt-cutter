const http = require('http');

const rootVideoUrl = `https://www.youtube.com/watch?v=EKvvptbTx6k`

// Test configuration
const testCases = [
    // {
    //     name: 'Video+Audio 720p/128k (default)',
    //     url: `http://localhost:3000/download?url=${rootVideoUrl}&start=00:00:00&end=00:00:05`
    // },
    {
        name: 'Video+Audio 480p/96k',
        url: `http://localhost:3000/download?url=${rootVideoUrl}&start=00:00:00&end=00:00:05&videoRes=480&audioRes=96`
    },
    // {
    //     name: 'Video-only 720p',
    //     url: `http://localhost:3000/download?url=${rootVideoUrl}&start=00:00:00&end=00:00:05&type=video`
    // },
    // {
    //     name: 'Audio-only 128k WAV',
    //     url: `http://localhost:3000/download?url=${rootVideoUrl}&start=00:00:00&end=00:00:05&type=audio&format=wav`
    // },
    // {
    //     name: 'Without force-keyframes',
    //     url: `http://localhost:3000/download?url=${rootVideoUrl}&start=00:00:00&end=00:00:05&forceKeyframes=false`
    // }
];

// Select which test to run (change index to test different cases)
const selectedTest = testCases[0];

console.log(`\n=== Testing: ${selectedTest.name} ===`);
console.log(`URL: ${selectedTest.url}\n`);

const request = http.get(selectedTest.url, function (response) {
    if (response.statusCode !== 200) {
        console.error(`Request failed with status code: ${response.statusCode}`);
        response.setEncoding('utf8');
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            console.error('Response:', data);
        });
        return;
    }

    let data = '';
    response.setEncoding('utf8');

    response.on('data', (chunk) => {
        data += chunk;
    });

    response.on('end', () => {
        try {
            const result = JSON.parse(data);
            console.log('✓ Download completed successfully!\n');
            console.log('Response:');
            console.log(JSON.stringify(result, null, 2));
            console.log(`\nDownload URL: ${result.downloadUrl}`);
            console.log(`File Size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Format: ${result.format}`);
        } catch (error) {
            console.error('Error parsing response:', error.message);
            console.error('Raw response:', data);
        }
    });
}).on('error', function (err) {
    console.error('Error making request:', err.message);
});
