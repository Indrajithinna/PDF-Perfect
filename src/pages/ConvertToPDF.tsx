import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import mammoth from 'mammoth';
import { Download, Upload, FileInput } from 'lucide-react';

const ConvertToPDF: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversionType, setConversionType] = useState<'image' | 'document'>('image');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: conversionType === 'image'
            ? {
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
            }
            : {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'text/plain': ['.txt']
            }
    });

    const convertImagesToPDF = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                let image;

                if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else {
                    // Convert other formats to canvas first
                    const img = await createImageBitmap(new Blob([arrayBuffer]));
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);

                    const pngData = await new Promise<ArrayBuffer>((resolve) => {
                        canvas.toBlob(async (blob) => {
                            if (blob) {
                                resolve(await blob.arrayBuffer());
                            }
                        }, 'image/png');
                    });

                    image = await pdfDoc.embedPng(pngData);
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted-images.pdf';
            link.click();
            URL.revokeObjectURL(url);

            setFiles([]);
        } catch (error) {
            console.error('Error converting images to PDF:', error);
            alert('Error converting images. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const convertDocumentToPDF = async () => {
        if (files.length === 0) return;

        setIsProcessing(true);
        try {
            const file = files[0];

            if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const html = result.value;

                // Create PDF from HTML
                const pdf = new jsPDF();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.style.width = '180mm';
                document.body.appendChild(tempDiv);

                // Simple text extraction and PDF creation
                const text = tempDiv.innerText;
                const lines = pdf.splitTextToSize(text, 180);
                pdf.text(lines, 15, 15);

                document.body.removeChild(tempDiv);
                pdf.save('converted-document.pdf');
            } else if (file.name.endsWith('.txt')) {
                const text = await file.text();
                const pdf = new jsPDF();
                const lines = pdf.splitTextToSize(text, 180);
                pdf.text(lines, 15, 15);
                pdf.save('converted-text.pdf');
            }

            setFiles([]);
        } catch (error) {
            console.error('Error converting document to PDF:', error);
            alert('Error converting document. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConvert = () => {
        if (conversionType === 'image') {
            convertImagesToPDF();
        } else {
            convertDocumentToPDF();
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Convert to PDF</h1>
                    <p className="text-white text-lg">
                        Convert images and documents to PDF format
                    </p>
                </div>

                <div className="glass-card p-8 mb-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            What do you want to convert?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => {
                                    setConversionType('image');
                                    setFiles([]);
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${conversionType === 'image'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <FileInput className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">Images</p>
                                <p className="text-xs text-gray-600">JPG, PNG, GIF, etc.</p>
                            </button>
                            <button
                                onClick={() => {
                                    setConversionType('document');
                                    setFiles([]);
                                }}
                                className={`p-4 rounded-lg border-2 transition-all ${conversionType === 'document'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <FileInput className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <p className="font-semibold text-gray-800">Documents</p>
                                <p className="text-xs text-gray-600">DOCX, TXT</p>
                            </button>
                        </div>
                    </div>

                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                            {isDragActive
                                ? `Drop ${conversionType === 'image' ? 'images' : 'documents'} here`
                                : `Drag & drop ${conversionType === 'image' ? 'images' : 'documents'} here`}
                        </p>
                        <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="glass-card p-8 mb-6 fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Files to Convert ({files.length})
                        </h3>
                        <div className="space-y-2 mb-6">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200"
                                >
                                    <span className="text-gray-700">{file.name}</span>
                                    <span className="text-sm text-gray-500">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleConvert}
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
                                        <span>Convert to PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <div className="glass-card p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Supported Formats:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700 mb-2">Images:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>JPG / JPEG</li>
                                <li>PNG</li>
                                <li>GIF</li>
                                <li>BMP</li>
                                <li>WebP</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-2">Documents:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>DOCX (Word)</li>
                                <li>TXT (Text)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConvertToPDF;
