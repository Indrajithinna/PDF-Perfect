import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Hash, Download, LayoutTemplate } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

type Position = 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right';

const PageNumbers: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [position, setPosition] = useState<Position>('bottom-center');
    const [startFrom, setStartFrom] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0 && validateFileSize(files[0], 100)) {
            setPdfFile(files[0]);
        }
    };

    const addPageNumbers = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const count = pages.length;

            pages.forEach((page, idx) => {
                const { width, height } = page.getSize();
                const fontSize = 12;
                const text = `Page ${idx + startFrom} of ${count + startFrom - 1}`;
                const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
                const margin = 20;

                let x = 0;
                let y = 0;

                switch (position) {
                    case 'bottom-center':
                        x = width / 2 - textWidth / 2;
                        y = margin;
                        break;
                    case 'bottom-left':
                        x = margin;
                        y = margin;
                        break;
                    case 'bottom-right':
                        x = width - textWidth - margin;
                        y = margin;
                        break;
                    case 'top-center':
                        x = width / 2 - textWidth / 2;
                        y = height - margin - fontSize;
                        break;
                    case 'top-left':
                        x = margin;
                        y = height - margin - fontSize;
                        break;
                    case 'top-right':
                        x = width - textWidth - margin;
                        y = height - margin - fontSize;
                        break;
                }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font: helveticaFont,
                    color: rgb(0, 0, 0),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `numbered-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('Page numbers added successfully!');
            setPdfFile(null);
        } catch (error) {
            console.error('Error adding page numbers:', error);
            alert('Error processing PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl mb-4">
                        <Hash className="w-12 h-12 text-teal-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">Add Page Numbers</h1>
                    <p className="text-gray-600 text-lg">Insert page numbers into your PDF with ease</p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop PDF to number here"
                        />
                    </div>
                ) : (
                    <div className="glass-card p-8 fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">{pdfFile.name}</h3>
                            <button onClick={() => setPdfFile(null)} className="text-red-500 text-sm hover:underline">Change File</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map((pos) => (
                                        <button
                                            key={pos}
                                            onClick={() => setPosition(pos)}
                                            className={`p-3 rounded-lg border-2 text-xs font-semibold flex flex-col items-center gap-1 transition-all ${position === pos
                                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                : 'border-gray-200 text-gray-600 hover:border-teal-200'
                                                }`}
                                        >
                                            <LayoutTemplate className="w-4 h-4" />
                                            {pos.replace('-', ' ').toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Numbering From</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={startFrom}
                                    onChange={(e) => setStartFrom(Math.max(1, Number(e.target.value)))}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-2">First page will have this number</p>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={addPageNumbers}
                                disabled={isProcessing}
                                loading={isProcessing}
                                variant="primary"
                                className="!bg-gradient-to-r !from-teal-500 !to-emerald-600"
                                icon={<Download className="w-5 h-5" />}
                            >
                                Add Numbers & Download
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageNumbers;
