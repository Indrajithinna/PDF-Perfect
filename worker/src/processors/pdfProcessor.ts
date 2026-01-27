import { Job } from 'bullmq';
import { downloadFile, uploadFile } from '../utils/storage';
import { PDFDocument } from 'pdf-lib';

export const pdfProcessor = async (job: Job) => {
    const { key, operation, params } = job.data;

    await job.updateProgress(10);

    // 1. Download file
    console.log(`Processing job ${job.id}: Downloading ${key}`);
    const fileBuffer = await downloadFile(key);
    await job.updateProgress(30);

    // 2. Process File
    console.log(`Processing job ${job.id}: Operation ${operation}`);
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // Example Operation: Watermark (just as a placeholder for logic)
    if (operation === 'watermark' && params?.text) {
        const pages = pdfDoc.getPages();
        const { width, height } = pages[0].getSize();
        // Draw text would be here, skipping detail to keep it generic
        // In real implementation we would use pdf-lib drawText
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
