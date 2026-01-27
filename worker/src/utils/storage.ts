import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config';
import { Readable } from 'stream';

const s3Client = new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    },
    forcePathStyle: true,
});

export const downloadFile = async (key: string): Promise<Buffer> => {
    const command = new GetObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
    });
    const response = await s3Client.send(command);

    if (!response.Body) {
        throw new Error("File not found");
    }

    // Convert stream to buffer
    const stream = response.Body as Readable;
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

export const uploadFile = async (key: string, body: Buffer | Uint8Array, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
    });
    await s3Client.send(command);
};
