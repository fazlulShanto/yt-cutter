import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        console.log('✓ Using existing MongoDB connection');
        return;
    }

    const mongoUri = process.env.MONGO_DB_URI;
    
    if (!mongoUri) {
        throw new Error('MONGO_DB_URI environment variable is not set');
    }

    try {
        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log('✓ Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export async function disconnectDB() {
    if (!isConnected) {
        return;
    }

    await mongoose.disconnect();
    isConnected = false;
    console.log('✓ Disconnected from MongoDB');
}
