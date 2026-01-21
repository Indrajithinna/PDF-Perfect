import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Download, Upload, Scissors } from 'lucide-react';

const SplitPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState<number>(0);
    const [splitMode, setSplitMode] = useState<'range' | 'individual'>('range');
    const [startPage, setStartPage] = useState<number>(1);
    const [endPage, setEndPage] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);

            // Get page count
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const count = pdf.getPageCount();
            setPageCount(count);
            setEndPage(count);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const splitPDF = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            if (splitMode === 'range') {
                // Extract specific range
                const newPdf = await PDFDocument.create();
                const pages = await newPdf.copyPages(
                    pdfDoc,
                    Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i)
                );
                pages.forEach(page => newPdf.addPage(page));

                const pdfBytes = await newPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `pages-${startPage}-to-${endPage}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
            } else {
                // Split into individual pages
                for (let i = 0; i < pageCount; i++) {
                    const newPdf = await PDFDocument.create();
                    const [page] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(page);

                    const pdfBytes = await newPdf.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `page-${i + 1}.pdf`;
                    link.click();
                    URL.revokeObjectURL(url);

                    // Small delay to avoid overwhelming the browser
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            alert('PDF split successfully!');
        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Error splitting PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Split PDF</h1>
                    <p className="text-white text-lg">
                        Extract pages or split PDF into multiple files
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
                                    <p className="text-sm text-gray-600">Total pages: {pageCount}</p>
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
                                    Split Mode:
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setSplitMode('range')}
                                        className={`p-4 rounded-lg border-2 transition-all ${splitMode === 'range'
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <Scissors className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">Extract Range</p>
                                        <p className="text-xs text-gray-600">Get specific pages</p>
                                    </button>
                                    <button
                                        onClick={() => setSplitMode('individual')}
                                        className={`p-4 rounded-lg border-2 transition-all ${splitMode === 'individual'
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <Scissors className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-800">Split All</p>
                                        <p className="text-xs text-gray-600">One page per file</p>
                                    </button>
                                </div>
                            </div>

                            {splitMode === 'range' && (
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Page:
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max={pageCount}
                                            value={startPage}
                                            onChange={(e) => setStartPage(Math.max(1, Math.min(pageCount, parseInt(e.target.value) || 1)))}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Page:
                                        </label>
                                        <input
                                            type="number"
                                            min={startPage}
                                            max={pageCount}
                                            value={endPage}
                                            onChange={(e) => setEndPage(Math.max(startPage, Math.min(pageCount, parseInt(e.target.value) || pageCount)))}
                                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    onClick={splitPDF}
                                    disabled={isProcessing}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            <span>Split & Download</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                                <li><strong>Extract Range:</strong> Get pages from start to end as a single PDF</li>
                                <li><strong>Split All:</strong> Create separate PDF files for each page</li>
                                <li>Downloads will start automatically after processing</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SplitPDF;
