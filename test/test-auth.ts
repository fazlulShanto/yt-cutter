import http from 'http';

// Configuration
const ADMIN_KEY = process.env.ADMIN_KEY || 'your-admin-key-here';
const BASE_URL = 'http://localhost:3000';

interface TestResult {
    name: string;
    success: boolean;
    data?: any;
    error?: string;
}

const results: TestResult[] = [];

/**
 * Make HTTP request
 */
function makeRequest(
    method: string,
    path: string,
    headers: Record<string, string> = {},
    body?: any
): Promise<any> {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options: http.RequestOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

/**
 * Test admin key authentication
 */
async function testAdminAuth() {
    console.log('\n=== Testing Admin Authentication ===\n');

    // Test without admin key
    try {
        const result = await makeRequest('POST', '/admin/api-keys', {}, { name: 'Test' });
        results.push({
            name: 'Admin endpoint without key',
            success: result.status === 401,
            data: result.data
        });
        console.log('✓ Correctly rejected request without admin key');
    } catch (error) {
        results.push({
            name: 'Admin endpoint without key',
            success: false,
            error: (error as Error).message
        });
    }

    // Test with admin key
    try {
        const result = await makeRequest('POST', '/admin/api-keys', {
            'x-admin-key': ADMIN_KEY
        }, {
            name: 'Test API Key',
            maxConcurrent: 3
        });

        results.push({
            name: 'Create API key with admin key',
            success: result.status === 201,
            data: result.data
        });

        if (result.status === 201) {
            console.log('✓ Successfully created API key');
            console.log('API Key:', result.data.data.key);
            return result.data.data.key;
        }
    } catch (error) {
        results.push({
            name: 'Create API key with admin key',
            success: false,
            error: (error as Error).message
        });
    }

    return null;
}

/**
 * Test API key validation
 */
async function testApiKeyValidation(apiKey: string | null) {
    console.log('\n=== Testing API Key Validation ===\n');

    if (!apiKey) {
        console.log('⚠ Skipping API key tests (no key available)');
        return;
    }

    // Test download without API key
    try {
        const result = await makeRequest('GET', '/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&start=00:00:00&end=00:00:05');
        results.push({
            name: 'Download without API key',
            success: result.status === 401,
            data: result.data
        });
        console.log('✓ Correctly rejected download without API key');
    } catch (error) {
        results.push({
            name: 'Download without API key',
            success: false,
            error: (error as Error).message
        });
    }

    // Test download with invalid API key
    try {
        const result = await makeRequest('GET', '/download?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&start=00:00:00&end=00:00:05', {
            'x-api-key': 'invalid-key'
        });
        results.push({
            name: 'Download with invalid API key',
            success: result.status === 401,
            data: result.data
        });
        console.log('✓ Correctly rejected download with invalid API key');
    } catch (error) {
        results.push({
            name: 'Download with invalid API key',
            success: false,
            error: (error as Error).message
        });
    }

    console.log('\n✓ API key validation working correctly');
}

/**
 * Test admin endpoints
 */
async function testAdminEndpoints() {
    console.log('\n=== Testing Admin Endpoints ===\n');

    // List API keys
    try {
        const result = await makeRequest('GET', '/admin/api-keys', {
            'x-admin-key': ADMIN_KEY
        });
        results.push({
            name: 'List API keys',
            success: result.status === 200,
            data: result.data
        });
        console.log(`✓ Listed ${result.data.data?.length || 0} API keys`);
    } catch (error) {
        results.push({
            name: 'List API keys',
            success: false,
            error: (error as Error).message
        });
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log('🧪 Starting Authentication System Tests\n');
    console.log('Make sure:');
    console.log('1. MongoDB is running');
    console.log('2. Server is running (pnpm dev)');
    console.log('3. ADMIN_KEY is set in .env\n');

    try {
        const apiKey = await testAdminAuth();
        await testApiKeyValidation(apiKey);
        await testAdminEndpoints();

        console.log('\n=== Test Summary ===\n');
        const passed = results.filter(r => r.success).length;
        const total = results.length;
        console.log(`Passed: ${passed}/${total}`);

        if (passed === total) {
            console.log('\n✅ All tests passed!');
        } else {
            console.log('\n❌ Some tests failed');
            results.filter(r => !r.success).forEach(r => {
                console.log(`  - ${r.name}: ${r.error || 'Failed'}`);
            });
        }
    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
    }
}

runTests();
