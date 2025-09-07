import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDatabase = async () => {
    try {
        const uri = process.env.CONNECT_MONGODB;
        if (!uri) throw new Error('Missing MongoDB connection string in env');
        await mongoose.connect(uri);
        console.log('connect database successful!');
    } catch (error) {
        console.error('Database connection failed:', (error as Error).message);
    }
};

export default connectDatabase;
