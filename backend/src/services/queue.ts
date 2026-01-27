import { Queue } from 'bullmq';
import { config } from '../config';

export const pdfQueue = new Queue('pdf-processing', {
    connection: config.redis,
});

export const addJob = async (name: string, data: any) => {
    return await pdfQueue.add(name, data);
};
