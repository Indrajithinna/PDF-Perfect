import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Download, Upload, Minimize2 } from 'lucide-react';

const CompressPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [compressedSize, setCompressedSize] = useState<number>(0);
    const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('medium');
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setOriginalSize(file.size);
            setCompressedSize(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const compressPDF = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Basic compression by re-saving the PDF
            // Note: This is a simplified compression. For better results, 
            // you might want to use additional libraries or techniques
            const pdfBytes = await pdfDoc.save({
                useObjectStreams: compressionLevel !== 'low',
                addDefaultPage: false,
                objectsPerTick: compressionLevel === 'high' ? 50 : 100,
            });

            setCompressedSize(pdfBytes.length);

            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `compressed-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error compressing PDF:', error);
            alert('Error compressing PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const compressionPercentage = originalSize > 0 && compressedSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Compress PDF</h1>
                    <p className="text-gray-600 text-lg">
                        Reduce PDF file size while maintaining quality
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
                                        Original size: {formatFileSize(originalSize)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setPdfFile(null);
                                        setOriginalSize(0);
                                        setCompressedSize(0);
                                    }}
                                    className="btn-secondary"
                                >
                                    Change File
                                </button>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Compression Level:
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setCompressionLevel('low')}
                                        className={`p-4 rounded-lg border-2 transition-all ${compressionLevel === 'low'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <Minimize2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">Low</p>
                                        <p className="text-xs text-gray-600">Best quality</p>
                                    </button>
                                    <button
                                        onClick={() => setCompressionLevel('medium')}
                                        className={`p-4 rounded-lg border-2 transition-all ${compressionLevel === 'medium'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <Minimize2 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">Medium</p>
                                        <p className="text-xs text-gray-600">Recommended</p>
                                    </button>
                                    <button
                                        onClick={() => setCompressionLevel('high')}
                                        className={`p-4 rounded-lg border-2 transition-all ${compressionLevel === 'high'
                                            ? 'border-pink-500 bg-pink-50'
                                            : 'border-gray-200 hover:border-pink-300'
                                            }`}
                                    >
                                        <Minimize2 className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">High</p>
                                        <p className="text-xs text-gray-600">Smallest size</p>
                                    </button>
                                </div>
                            </div>

                            {compressedSize > 0 && (
                                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-800">Compression Result:</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {compressionPercentage}% smaller
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Original:</p>
                                            <p className="font-semibold text-gray-800">{formatFileSize(originalSize)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Compressed:</p>
                                            <p className="font-semibold text-gray-800">{formatFileSize(compressedSize)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    onClick={compressPDF}
                                    disabled={isProcessing}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Compressing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>Compress & Download</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Compression Tips:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                <li><strong>Low:</strong> Minimal compression, preserves maximum quality</li>
                                <li><strong>Medium:</strong> Balanced compression, good for most documents</li>
                                <li><strong>High:</strong> Maximum compression, may reduce quality slightly</li>
                                <li>Results vary based on the original PDF content and structure</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompressPDF;
