import { Context, Next } from "hono";
import { ApiKey } from "../db/models/ApiKey";

/**
 * Middleware to validate admin key from header
 */
export async function validateAdminKey(c: Context, next: Next) {
    const adminKey = c.req.header("x-admin-key");
    const expectedAdminKey = process.env.ADMIN_KEY;

    if (!expectedAdminKey) {
        return c.json(
            { success: false, error: "Admin key not configured" },
            500
        );
    }

    if (!adminKey || adminKey !== expectedAdminKey) {
        return c.json(
            { success: false, error: "Invalid or missing admin key" },
            401
        );
    }

    await next();
}

/**
 * Middleware to validate API key from header
 */
export async function validateApiKey(c: Context, next: Next) {
    const apiKey = c.req.header("x-api-key");

    if (!apiKey) {
        return c.json({ success: false, error: "API key required" }, 401);
    }

    const keyDoc = await ApiKey.findOne({ key: apiKey });

    if (!keyDoc) {
        return c.json({ success: false, error: "Invalid API key" }, 401);
    }

    // Store API key document in context for later use
    c.set("apiKeyDoc", keyDoc);

    await next();
}

/**
 * Middleware to check if API key has available quota
 */
export async function checkQuota(c: Context, next: Next) {
    const keyDoc = c.get("apiKeyDoc");

    if (!keyDoc) {
        return c.json(
            { success: false, error: "API key not found in context" },
            500
        );
    }

    if (keyDoc.currentUsage >= keyDoc.maxConcurrent) {
        return c.json(
            {
                success: false,
                error: "Quota exceeded",
                details: {
                    currentUsage: keyDoc.currentUsage,
                    maxConcurrent: keyDoc.maxConcurrent,
                },
            },
            429
        );
    }

    await next();
}

/**
 * Increment usage counter for API key
 */
export async function incrementUsage(apiKey: string): Promise<void> {
    await ApiKey.findOneAndUpdate(
        { key: apiKey },
        {
            $inc: { currentUsage: 1 },
            $set: { lastUsedAt: new Date() },
        }
    );
}

/**
 * Decrement usage counter for API key
 */
export async function decrementUsage(apiKey: string): Promise<void> {
    // First decrement, then ensure it doesn't go below 0
    const result = await ApiKey.findOneAndUpdate(
        { key: apiKey, currentUsage: { $gt: 0 } }, // Only decrement if > 0
        { $inc: { currentUsage: -1 } },
        { new: true }
    );

    // If no document was updated (currentUsage was already 0), ensure it stays at 0
    if (!result) {
        await ApiKey.findOneAndUpdate(
            { key: apiKey },
            { $set: { currentUsage: 0 } }
        );
    }
}
