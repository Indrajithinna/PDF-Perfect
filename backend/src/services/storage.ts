import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../config';

export const s3Client = new S3Client({
    region: config.s3.region,
    endpoint: config.s3.endpoint,
    credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
    },
    forcePathStyle: true, // Needed for MinIO
});

export const uploadFile = async (key: string, body: Buffer | Uint8Array, contentType: string) => {
    const command = new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
    });
    await s3Client.send(command);
};

export const getDownloadUrl = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: config.s3.bucket,
        Key: key,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
