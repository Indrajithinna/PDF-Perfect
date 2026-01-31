import dotenv from 'dotenv';
dotenv.config();

export const config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    s3: {
        endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
        region: process.env.S3_REGION || 'us-east-1',
        accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
        bucket: process.env.S3_BUCKET || 'pdf-storage',
    },
};
