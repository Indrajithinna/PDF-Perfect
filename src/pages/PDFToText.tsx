import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Type, Copy, FileText, Download } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

const PDFToText: React.FC = () => {
    useEffect(() => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }, []);

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0 && validateFileSize(files[0], 100)) {
            setPdfFile(files[0]);
            setExtractedText('');
            setProgress(0);
        }
    };

    const extractText = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        setExtractedText('');
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;

            let fullText = '';

            for (let i = 1; i <= doc.numPages; i++) {
                const page = await doc.getPage(i);
                const textContent = await page.getTextContent();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += `--- Page ${i} ---\n\n${pageText}\n\n`;

                setProgress(Math.round((i / doc.numPages) * 100));
            }

            setExtractedText(fullText);
        } catch (error) {
            console.error('Error parsing PDF:', error);
            alert('Error parsing PDF. Is it a scanned image? Try OCR tool instead.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(extractedText);
        alert('Text copied to clipboard!');
    };

    const downloadTextFile = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${pdfFile?.name.replace('.pdf', '')}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-4">
                        <Type className="w-12 h-12 text-gray-700" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">PDF to Text</h1>
                    <p className="text-gray-600 text-lg">Extract text content from your PDF documents</p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop PDF to extract text"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Sidebar Control */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="glass-card p-6">
                                <h3 className="font-bold text-gray-800 mb-2 truncate" title={pdfFile.name}>{pdfFile.name}</h3>
                                <p className="text-sm text-gray-500 mb-6">{(pdfFile.size / 1024).toFixed(1)} KB</p>

                                {!extractedText ? (
                                    <>
                                        {isProcessing && (
                                            <div className="mb-4">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <p className="text-xs text-center mt-1 text-gray-500">{progress}%</p>
                                            </div>
                                        )}
                                        <Button
                                            onClick={extractText}
                                            disabled={isProcessing}
                                            loading={isProcessing}
                                            variant="primary"
                                            className="w-full !bg-gray-800 hover:!bg-gray-900"
                                            icon={<FileText className="w-4 h-4" />}
                                        >
                                            Start Extraction
                                        </Button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Button
                                            onClick={downloadTextFile}
                                            variant="primary"
                                            className="w-full"
                                            icon={<Download className="w-4 h-4" />}
                                        >
                                            Download .txt
                                        </Button>
                                        <Button
                                            onClick={copyToClipboard}
                                            variant="secondary"
                                            className="w-full"
                                            icon={<Copy className="w-4 h-4" />}
                                        >
                                            Copy to Clipboard
                                        </Button>
                                        <Button
                                            onClick={() => { setPdfFile(null); setExtractedText(''); }}
                                            variant="outline"
                                            className="w-full border-red-200 text-red-500 hover:bg-red-50"
                                        >
                                            Start Over
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result Area */}
                        <div className="lg:col-span-2">
                            <div className="glass-card p-6 h-[600px] flex flex-col">
                                <h3 className="font-bold text-gray-800 mb-4">Extracted Content</h3>
                                {extractedText ? (
                                    <textarea
                                        readOnly
                                        value={extractedText}
                                        className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-gray-50 font-mono text-sm resize-none focus:outline-none"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <FileText className="w-12 h-12 mb-2 opacity-20" />
                                        <p>Text content will appear here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PDFToText;
