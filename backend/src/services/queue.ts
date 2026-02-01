import { Queue } from 'bullmq';
import { config } from '../config';

/**
 * PDF Processing Queue
 * Handles background job processing for PDF operations
 */
export const pdfQueue = new Queue('pdf-processing', {
    connection: config.redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true, // Keep Redis clean
        removeOnFail: {
            age: 24 * 3600 // Keep failed jobs for 24h
        }
    }
});

export const addJob = async (name: string, data: Record<string, unknown>) => {
    return await pdfQueue.add(name, data);
};
