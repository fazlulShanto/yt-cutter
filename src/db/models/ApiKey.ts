import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
    key: string;
    name: string;
    maxConcurrent: number;
    currentUsage: number;
    createdAt: Date;
    lastUsedAt?: Date;
}

const ApiKeySchema = new Schema<IApiKey>({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    maxConcurrent: {
        type: Number,
        required: true,
        default: 2,
        min: 1
    },
    currentUsage: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsedAt: {
        type: Date
    }
});

export const ApiKey = mongoose.model<IApiKey>('ApiKey', ApiKeySchema, 'api_keys');
