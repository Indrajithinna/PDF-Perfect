import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';

import { validateFileSize } from '../utils/fileUtils';

const PDFToImages: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
    const [imageQuality, setImageQuality] = useState<number>(0.95);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const MAX_SIZE_MB = 100;

        if (file && file.type === 'application/pdf') {
            if (!validateFileSize(file, MAX_SIZE_MB)) {
                alert(`File ${file.name} exceeds the ${MAX_SIZE_MB}MB limit.`);
                return;
            }

            setPdfFile(file);

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            setPageCount(pdf.getPageCount());
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const convertPDFToImages = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            const zip = new JSZip();
            const images: { blob: Blob; name: string }[] = [];

            // Create a temporary container for rendering
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            for (let i = 0; i < pageCount; i++) {
                // Create a new PDF with just this page
                const singlePagePdf = await PDFDocument.create();
                const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
                singlePagePdf.addPage(copiedPage);
                const pdfBytes = await singlePagePdf.save();

                // Create blob URL for the single page
                const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                // Create iframe to render PDF
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                container.appendChild(iframe);

                // Wait for iframe to load
                await new Promise((resolve) => {
                    iframe.onload = resolve;
                });

                // Capture the iframe content
                const canvas = await html2canvas(iframe, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                // Convert canvas to blob
                const imageBlob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) resolve(blob);
                        },
                        imageFormat === 'png' ? 'image/png' : 'image/jpeg',
                        imageQuality
                    );
                });

                const fileName = `page-${i + 1}.${imageFormat}`;
                images.push({ blob: imageBlob, name: fileName });
                zip.file(fileName, imageBlob);

                // Cleanup
                URL.revokeObjectURL(url);
                container.removeChild(iframe);
            }

            // Remove temporary container
            document.body.removeChild(container);

            // Download as ZIP if multiple pages, or single image if one page
            if (images.length === 1) {
                saveAs(images[0].blob, images[0].name);
            } else {
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                saveAs(zipBlob, 'pdf-pages.zip');
            }

            alert(`Successfully converted ${pageCount} page(s) to ${imageFormat.toUpperCase()}`);
        } catch (error) {
            console.error('Error converting PDF to images:', error);
            alert('Error converting PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">PDF to Images</h1>
                    <p className="text-white text-lg">
                        Extract all pages as high-quality images
                    </p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6">
                        <div
                            {...getRootProps()}
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                {isDragActive ? 'Drop PDF file here' : 'Drag & drop a PDF file here'}
                            </p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="glass-card p-8 fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{pdfFile.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        {pageCount} page{pageCount !== 1 ? 's' : ''} will be converted
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPdfFile(null);
                                        setPageCount(0);
                                    }}
                                    className="btn-secondary"
                                >
                                    Change File
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Image Format:
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setImageFormat('png')}
                                        className={`p-4 rounded-lg border-2 transition-all ${imageFormat === 'png'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <ImageIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">PNG</p>
                                        <p className="text-xs text-gray-600">Lossless, larger files</p>
                                    </button>
                                    <button
                                        onClick={() => setImageFormat('jpeg')}
                                        className={`p-4 rounded-lg border-2 transition-all ${imageFormat === 'jpeg'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <ImageIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">JPEG</p>
                                        <p className="text-xs text-gray-600">Compressed, smaller files</p>
                                    </button>
                                </div>
                            </div>

                            {imageFormat === 'jpeg' && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Quality: {Math.round(imageQuality * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="1"
                                        step="0.05"
                                        value={imageQuality}
                                        onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Lower quality</span>
                                        <span>Higher quality</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    onClick={convertPDFToImages}
                                    disabled={isProcessing}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Converting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>Convert & Download</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Output:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                <li>Single page PDFs will download as a single image</li>
                                <li>Multi-page PDFs will download as a ZIP file containing all images</li>
                                <li>Images are named sequentially (page-1, page-2, etc.)</li>
                                <li>High resolution output for best quality</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFToImages;
