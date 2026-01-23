import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Download, Upload, Trash2, GripVertical } from 'lucide-react';

interface PDFFile {
    file: File;
    id: string;
}

const MergePDF: React.FC = () => {
    const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newFiles = acceptedFiles
            .filter(file => file.type === 'application/pdf')
            .map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9)
            }));
        setPdfFiles(prev => [...prev, ...newFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        }
    });

    const removeFile = (id: string) => {
        setPdfFiles(prev => prev.filter(f => f.id !== id));
    };

    const mergePDFs = async () => {
        if (pdfFiles.length < 2) {
            alert('Please add at least 2 PDF files to merge');
            return;
        }

        setIsProcessing(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const pdfFile of pdfFiles) {
                const arrayBuffer = await pdfFile.file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => {
                    mergedPdf.addPage(page);
                });
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'merged-document.pdf';
            link.click();
            URL.revokeObjectURL(url);

            setPdfFiles([]);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Error merging PDFs. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Merge PDF Files</h1>
                    <p className="text-gray-600 text-lg">
                        Combine multiple PDF documents into one file
                    </p>
                </div>

                <div className="glass-card p-8 mb-6">
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
                        </p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                </div>

                {pdfFiles.length > 0 && (
                    <div className="glass-card p-8 mb-6 fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Files to Merge ({pdfFiles.length})
                        </h3>
                        <div className="space-y-3">
                            {pdfFiles.map((pdfFile, index) => (
                                <div
                                    key={pdfFile.id}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <GripVertical className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-purple-600">#{index + 1}</span>
                                        <span className="text-gray-700">{pdfFile.file.name}</span>
                                        <span className="text-sm text-gray-500">
                                            ({(pdfFile.file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(pdfFile.id)}
                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={mergePDFs}
                                disabled={isProcessing || pdfFiles.length < 2}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Merging...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5" />
                                        <span>Merge & Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div className="glass-card p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">How to use:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        <li>Upload or drag & drop your PDF files</li>
                        <li>Arrange them in the desired order (drag to reorder)</li>
                        <li>Click "Merge & Download" to combine them</li>
                        <li>Your merged PDF will download automatically</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default MergePDF;
