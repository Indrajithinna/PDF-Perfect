import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('3000').transform(Number),
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.string().default('6379').transform(Number),
    S3_ENDPOINT: z.string().default('http://localhost:9000'),
    S3_REGION: z.string().default('us-east-1'),
    S3_ACCESS_KEY: z.string().default('minioadmin'),
    S3_SECRET_KEY: z.string().default('minioadmin'),
    S3_BUCKET: z.string().default('pdf-storage'),
    JWT_SECRET: z.string().default('super-secret-jwt-key'),
});

const env = envSchema.parse(process.env);

export const config: Config = {
    port: env.PORT,
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
    },
    s3: {
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
        accessKeyId: env.S3_ACCESS_KEY,
        secretAccessKey: env.S3_SECRET_KEY,
        bucket: env.S3_BUCKET,
    },
    jwtSecret: env.JWT_SECRET,
};

type Config = {
    port: number;
    redis: { host: string; port: number };
    s3: { endpoint: string; region: string; accessKeyId: string; secretAccessKey: string; bucket: string };
    jwtSecret: string;
};
