import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
    fastify.get('/health', async (_request, _reply) => {
        return {
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            service: 'pdf-perfect-api'
        };
    });
}
