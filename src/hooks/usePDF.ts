import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

interface UsePDFMergeResult {
    mergePDFs: (files: File[]) => Promise<Blob>;
    isLoading: boolean;
    error: string | null;
}

export const usePDFMerge = (): UsePDFMergeResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mergePDFs = useCallback(async (files: File[]): Promise<Blob> => {
        setIsLoading(true);
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const pdfBytes = await mergedPdf.save();
            return new Blob([pdfBytes], { type: 'application/pdf' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to merge PDFs';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { mergePDFs, isLoading, error };
};

interface UsePDFSplitResult {
    splitPDF: (file: File, startPage: number, endPage: number) => Promise<Blob>;
    splitAllPages: (file: File) => Promise<Blob[]>;
    isLoading: boolean;
    error: string | null;
}

export const usePDFSplit = (): UsePDFSplitResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const splitPDF = useCallback(async (file: File, startPage: number, endPage: number): Promise<Blob> => {
        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            const pages = await newPdf.copyPages(
                pdfDoc,
                Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i)
            );
            pages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            return new Blob([pdfBytes], { type: 'application/pdf' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to split PDF';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const splitAllPages = useCallback(async (file: File): Promise<Blob[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();
            const blobs: Blob[] = [];

            for (let i = 0; i < pageCount; i++) {
                const newPdf = await PDFDocument.create();
                const [page] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(page);

                const pdfBytes = await newPdf.save();
                blobs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
            }

            return blobs;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to split PDF pages';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { splitPDF, splitAllPages, isLoading, error };
};

interface UsePDFInfoResult {
    getPageCount: (file: File) => Promise<number>;
    getFileSize: (file: File) => number;
    isLoading: boolean;
    error: string | null;
}

export const usePDFInfo = (): UsePDFInfoResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPageCount = useCallback(async (file: File): Promise<number> => {
        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            return pdf.getPageCount();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get page count';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getFileSize = useCallback((file: File): number => {
        return file.size;
    }, []);

    return { getPageCount, getFileSize, isLoading, error };
};
