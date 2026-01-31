import { Worker } from 'bullmq';
import { config } from './config';
import { pdfProcessor } from './processors/pdfProcessor';

const worker = new Worker('pdf-processing', pdfProcessor, {
    connection: config.redis,
    concurrency: 5, // Can process 5 jobs at once per worker instance
});

worker.on('completed', job => {
    console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`);
});

console.log('Worker started processing jobs...');
