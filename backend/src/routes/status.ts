import { FastifyInstance } from 'fastify';
import { pdfQueue } from '../services/queue';
import { getDownloadUrl } from '../services/storage';

export async function statusRoutes(fastify: FastifyInstance) {
    fastify.get('/status/:jobId', async (request, reply) => {
        const { jobId } = request.params as { jobId: string };
        const job = await pdfQueue.getJob(jobId);

        if (!job) {
            return reply.status(404).send({ error: 'Job not found' });
        }

        const state = await job.getState();
        const result = job.returnvalue;

        let downloadUrl = null;
        if (state === 'completed' && result?.key) {
            downloadUrl = await getDownloadUrl(result.key);
        }

        return reply.send({
            id: job.id,
            state,
            progress: job.progress,
            result,
            downloadUrl
        });
    });
}
