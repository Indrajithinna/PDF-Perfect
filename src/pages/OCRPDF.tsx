import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { ScanText, Download, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

// Initialize PDF.js worker
// Using a specific stable version from CDN to ensure compatibility if local import fails
// or ideally use the one matching package.json
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const OCRPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Cleanup worker function
    const workerRef = useRef<Tesseract.Worker | null>(null);

    useEffect(() => {
        return () => {
            // Cleanup worker when component unmounts
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0 && validateFileSize(files[0], 50)) {
            setPdfFile(files[0]);
            setExtractedText('');
            setProgress(0);
            setStatus('');
            setErrorMsg('');
        }
    };

    const runOCR = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        setExtractedText('');
        setErrorMsg('');
        setProgress(0);

        try {
            setStatus('Initializing OCR engine...');

            // Create worker only if it doesn't exist
            if (!workerRef.current) {
                workerRef.current = await createWorker('eng', 1, {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            // This is per-page progress, hard to map to total overall without complex maths
                            // We will handle progress manually per page loop
                        }
                    }
                });
            }

            setStatus('Loading PDF document...');
            const arrayBuffer = await pdfFile.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;

            let fullText = '';

            for (let i = 1; i <= doc.numPages; i++) {
                setStatus(`Processing page ${i} of ${doc.numPages}...`);
                const page = await doc.getPage(i);

                // Render page to canvas
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport } as any).promise;

                    setStatus(`Recognizing text on page ${i}/${doc.numPages}...`);
                    const dataUrl = canvas.toDataURL('image/png');

                    if (workerRef.current) {
                        const { data: { text } } = await workerRef.current.recognize(dataUrl);
                        fullText += `--- Page ${i} ---\n\n${text}\n\n`;
                    }

                    // Update overall progress
                    setProgress(Math.round((i / doc.numPages) * 100));
                }
            }

            setStatus('Completed!');
            setExtractedText(fullText);
        } catch (error: any) {
            console.error('Error in OCR:', error);
            setErrorMsg(error.message || 'An error occurred during OCR processing.');
            setStatus('Failed');
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
        link.download = `${pdfFile?.name.replace('.pdf', '')}_ocr.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl mb-4">
                        <ScanText className="w-12 h-12 text-yellow-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">OCR PDF Scanner</h1>
                    <p className="text-gray-600 text-lg dark:text-gray-300">Convert scanned documents and images into editable text</p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop scanned PDF here"
                            description="Heavy files may take longer to process"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                        {/* Sidebar Control */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="glass-card p-6">
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 truncate" title={pdfFile.name}>{pdfFile.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{(pdfFile.size / 1024).toFixed(1)} KB</p>

                                {!extractedText ? (
                                    <>
                                        {isProcessing && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    <span>{status}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                                                    <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {errorMsg && (
                                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                <span>{errorMsg}</span>
                                            </div>
                                        )}

                                        <Button
                                            onClick={runOCR}
                                            disabled={isProcessing}
                                            loading={isProcessing}
                                            variant="primary"
                                            className="w-full !bg-yellow-600 hover:!bg-yellow-700"
                                            icon={<ScanText className="w-4 h-4" />}
                                        >
                                            {isProcessing ? 'Scanning...' : 'Start OCR'}
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
                                            onClick={() => { setPdfFile(null); setExtractedText(''); setProgress(0); setStatus(''); }}
                                            variant="outline"
                                            className="w-full border-red-200 text-red-500 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                                            icon={<RefreshCw className="w-4 h-4" />}
                                        >
                                            Start Over
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl text-xs text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
                                <strong>Note:</strong> OCR is a heavy process handled entirely in your browser. Large files with many pages may cause the page to become unresponsive temporarily.
                            </div>
                        </div>

                        {/* Result Area */}
                        <div className="lg:col-span-2">
                            <div className="glass-card p-6 h-[600px] flex flex-col">
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Recognized Text</h3>
                                {extractedText ? (
                                    <textarea
                                        readOnly
                                        value={extractedText}
                                        className="flex-1 w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 font-mono text-sm resize-none focus:outline-none dark:text-gray-300"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50/50 dark:bg-slate-800/50">
                                        <ScanText className="w-12 h-12 mb-2 opacity-20" />
                                        <p>OCR results will appear here</p>
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

export default OCRPDF;
