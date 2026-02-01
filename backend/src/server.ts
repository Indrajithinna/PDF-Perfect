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

server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
        error: {
            message: error.message || 'Internal Server Error',
            statusCode,
            code: error.code
        }
    });
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

import { healthRoutes } from './routes/health';

// ... imports

server.register(async function () {
    // ... websocket logic
});

server.register(healthRoutes, { prefix: '/api' });
server.register(uploadRoutes, { prefix: '/api' });
server.register(statusRoutes, { prefix: '/api' });

// Graceful shutdown
const closeGracefully = async (signal: string) => {
    console.log(`Received ${signal}. Closing server...`);
    await server.close();
    process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

const start = async () => {
    try {
        await server.listen({ port: config.port, host: '0.0.0.0' });
        console.log(`[${new Date().toISOString()}] Server listening at http://0.0.0.0:${config.port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
