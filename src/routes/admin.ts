import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { ApiKey } from '../db/models/ApiKey';
import { validateAdminKey } from '../middleware/auth';
import { CreateApiKeyRequest, ApiKeyResponse, UpdateApiKeyRequest } from '../types';

const admin = new Hono();

// All admin routes require admin key
admin.use('/*', validateAdminKey);

/**
 * POST /admin/api-keys - Create new API key
 */
admin.post('/api-keys', async (c) => {
    try {
        const body = await c.req.json<CreateApiKeyRequest>();

        if (!body.name || body.name.trim() === '') {
            return c.json({ success: false, error: 'Name is required' }, 400);
        }

        // Generate unique API key
        const key = `yt_${nanoid(32)}`;

        const apiKey = await ApiKey.create({
            key,
            name: body.name.trim(),
            maxConcurrent: body.maxConcurrent || 2,
            currentUsage: 0
        });

        const response: ApiKeyResponse = {
            id: apiKey._id.toString(),
            key: apiKey.key,
            name: apiKey.name,
            maxConcurrent: apiKey.maxConcurrent,
            currentUsage: apiKey.currentUsage,
            createdAt: apiKey.createdAt.toISOString(),
            lastUsedAt: apiKey.lastUsedAt?.toISOString()
        };

        return c.json({ success: true, data: response }, 201);
    } catch (error) {
        console.error('Error creating API key:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

/**
 * GET /admin/api-keys - List all API keys
 */
admin.get('/api-keys', async (c) => {
    try {
        const apiKeys = await ApiKey.find().sort({ createdAt: -1 });

        const response: ApiKeyResponse[] = apiKeys.map(key => ({
            id: key._id.toString(),
            key: key.key,
            name: key.name,
            maxConcurrent: key.maxConcurrent,
            currentUsage: key.currentUsage,
            createdAt: key.createdAt.toISOString(),
            lastUsedAt: key.lastUsedAt?.toISOString()
        }));

        return c.json({ success: true, data: response });
    } catch (error) {
        console.error('Error listing API keys:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

/**
 * GET /admin/api-keys/:id - Get specific API key
 */
admin.get('/api-keys/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const apiKey = await ApiKey.findById(id);

        if (!apiKey) {
            return c.json({ success: false, error: 'API key not found' }, 404);
        }

        const response: ApiKeyResponse = {
            id: apiKey._id.toString(),
            key: apiKey.key,
            name: apiKey.name,
            maxConcurrent: apiKey.maxConcurrent,
            currentUsage: apiKey.currentUsage,
            createdAt: apiKey.createdAt.toISOString(),
            lastUsedAt: apiKey.lastUsedAt?.toISOString()
        };

        return c.json({ success: true, data: response });
    } catch (error) {
        console.error('Error getting API key:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

/**
 * PATCH /admin/api-keys/:id - Update API key
 */
admin.patch('/api-keys/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json<UpdateApiKeyRequest>();

        const updateData: any = {};
        if (body.maxConcurrent !== undefined) {
            if (body.maxConcurrent < 1) {
                return c.json({ success: false, error: 'maxConcurrent must be at least 1' }, 400);
            }
            updateData.maxConcurrent = body.maxConcurrent;
        }
        if (body.name !== undefined && body.name.trim() !== '') {
            updateData.name = body.name.trim();
        }

        const apiKey = await ApiKey.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!apiKey) {
            return c.json({ success: false, error: 'API key not found' }, 404);
        }

        const response: ApiKeyResponse = {
            id: apiKey._id.toString(),
            key: apiKey.key,
            name: apiKey.name,
            maxConcurrent: apiKey.maxConcurrent,
            currentUsage: apiKey.currentUsage,
            createdAt: apiKey.createdAt.toISOString(),
            lastUsedAt: apiKey.lastUsedAt?.toISOString()
        };

        return c.json({ success: true, data: response });
    } catch (error) {
        console.error('Error updating API key:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

/**
 * POST /admin/api-keys/:id/reset-quota - Reset current usage quota
 */
admin.post('/api-keys/:id/reset-quota', async (c) => {
    try {
        const id = c.req.param('id');
        
        const apiKey = await ApiKey.findByIdAndUpdate(
            id,
            { $set: { currentUsage: 0 } },
            { new: true }
        );

        if (!apiKey) {
            return c.json({ success: false, error: 'API key not found' }, 404);
        }

        const response: ApiKeyResponse = {
            id: apiKey._id.toString(),
            key: apiKey.key,
            name: apiKey.name,
            maxConcurrent: apiKey.maxConcurrent,
            currentUsage: apiKey.currentUsage,
            createdAt: apiKey.createdAt.toISOString(),
            lastUsedAt: apiKey.lastUsedAt?.toISOString()
        };

        return c.json({ success: true, data: response, message: 'Quota reset successfully' });
    } catch (error) {
        console.error('Error resetting quota:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

/**
 * DELETE /admin/api-keys/:id - Delete API key
 */
admin.delete('/api-keys/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const apiKey = await ApiKey.findByIdAndDelete(id);

        if (!apiKey) {
            return c.json({ success: false, error: 'API key not found' }, 404);
        }

        return c.json({ 
            success: true, 
            message: 'API key deleted successfully',
            deletedKey: {
                id: apiKey._id.toString(),
                name: apiKey.name
            }
        });
    } catch (error) {
        console.error('Error deleting API key:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return c.json({ success: false, error: errorMessage }, 500);
    }
});

export default admin;
