import { Job } from 'bullmq';
import { downloadFile, uploadFile } from '../utils/storage';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

type OperationParams = {
    text?: string;
    imageKey?: string;
    // Common
    fontSize?: number;
    opacity?: number;
    rotation?: number;
    // ... other params
    type?: 'text' | 'image';
    tiled?: boolean;
}

export const pdfProcessor = async (job: Job) => {
    const { key, operation, params } = job.data as { key: string, operation: string, params: OperationParams };

    await job.updateProgress(10);

    // 1. Download file
    console.log(`Processing job ${job.id}: Downloading ${key}`);
    const fileBuffer = await downloadFile(key);
    await job.updateProgress(30);

    // 2. Load PDF
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // 3. Delegate Operation
    console.log(`Processing job ${job.id}: Operation ${operation}`);

    switch (operation) {
        case 'watermark':
            await handleWatermark(pdfDoc, params);
            break;
        case 'merge':
            // Placeholder
            await job.log('Merge operation not implemented');
            break;
        case 'split':
            // Placeholder
            await job.log('Split operation not implemented');
            break;
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }

    // Save document
    const processedPdfBytes = await pdfDoc.save();
    await job.updateProgress(80);

    // 3. Upload Result
    const resultKey = `processed/${job.id}.pdf`;
    console.log(`Processing job ${job.id}: Uploading to ${resultKey}`);
    await uploadFile(resultKey, Buffer.from(processedPdfBytes), 'application/pdf');

    await job.updateProgress(100);

    return { key: resultKey };
};

async function handleWatermark(pdfDoc: PDFDocument, params: OperationParams) {
    const pages = pdfDoc.getPages();
    const {
        text,
        type = 'text',
        fontSize = 48,
        opacity = 0.3,
        rotation = 45,
        tiled = false
    } = params;

    if (type === 'text' && text) {
        for (const page of pages) {
            const { width, height } = page.getSize();
            // Simplify logic for backend demo: center text
            page.drawText(text, {
                x: width / 2 - (text.length * fontSize) / 4,
                y: height / 2,
                size: fontSize,
                opacity: opacity,
                rotate: degrees(rotation),
                color: rgb(0.5, 0.5, 0.5) // Gray
            });
        }
    } else if (type === 'image' && params.imageKey) {
        // Handle image download and embedding would go here
        console.log("Image watermark requested but simplified for this demo");
    }
}
