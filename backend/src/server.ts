import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { uploadRoutes } from './routes/upload';
import { statusRoutes } from './routes/status';
import { config } from './config';
import { pdfQueue } from './services/queue';

const server = Fastify({
    logger: true,
});

server.register(cors, {
    origin: '*', // Adjust for production
});

server.register(multipart, {
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    }
});
server.register(websocket);

server.register(async function (fastify) {
    fastify.get('/ws/status/:jobId', { websocket: true }, (connection, req) => {
        const { jobId } = req.params as { jobId: string };

        // Subscribe to job events locally or just poll slightly more efficiently?
        // BullMQ events happen in the queue context.
        // For simplicity sake in a multi-instance env, we should rely on Redis Pub/Sub for events.
        // But since BullMQ uses Redis, we can use QueueEvents.

        // However, handling QueueEvents for every connection might be heavy.
        // Simplest approach: Client polls or we keep checking.
        // BETTER: Use BullMQ QueueEvents.

        const interval = setInterval(async () => {
            const job = await pdfQueue.getJob(jobId);
            if (job) {
                const state = await job.getState();
                connection.socket.send(JSON.stringify({ state, progress: job.progress }));
                if (state === 'completed' || state === 'failed') {
                    clearInterval(interval);
                    connection.socket.close();
                }
            }
        }, 2000);

        connection.socket.on('close', () => {
            clearInterval(interval);
        });
    });
});

server.register(uploadRoutes, { prefix: '/api' });
server.register(statusRoutes, { prefix: '/api' });

server.listen({ port: config.port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
