import { FastifyInstance } from 'fastify';
import { addJob } from '../services/queue';
import { uploadFile } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

export async function uploadRoutes(fastify: FastifyInstance) {
    fastify.post('/upload', async (request, reply) => {
        const parts = request.parts();

        let pdfFileKey = '';
        let imageFileKey = '';
        let operation = 'process-pdf'; // default
        let params: any = {};
        const fileId = uuidv4();

        for await (const part of parts) {
            if (part.type === 'file') {
                const buffer = await part.toBuffer();
                if (part.fieldname === 'file') {
                    pdfFileKey = `raw/${fileId}.pdf`;
                    await uploadFile(pdfFileKey, buffer, 'application/pdf');
                } else if (part.fieldname === 'image') {
                    imageFileKey = `raw/${fileId}_image.png`; // Simplify extension handling
                    await uploadFile(imageFileKey, buffer, part.mimetype);
                }
            } else {
                // Field
                if (part.fieldname === 'operation') {
                    operation = (part.value as string);
                } else if (part.fieldname === 'params') {
                    try {
                        params = JSON.parse(part.value as string);
                    } catch (e) {
                        console.error('Failed to parse params json');
                    }
                }
            }
        }

        if (!pdfFileKey) {
            return reply.status(400).send({ error: 'No PDF file uploaded' });
        }

        // Pass keys to job
        if (imageFileKey) {
            params.imageKey = imageFileKey;
        }

        const job = await addJob(operation, {
            fileId,
            key: pdfFileKey,
            operation,
            params
        });

        return reply.send({ jobId: job.id, fileId });
    });
}
