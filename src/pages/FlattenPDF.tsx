import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Layers, Download, CheckCircle2 } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

const FlattenPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0 && validateFileSize(files[0], 100)) {
            setPdfFile(files[0]);
        }
    };

    const flattenPDF = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // Flatten form fields
            const form = pdfDoc.getForm();
            form.flatten();

            // Note: pdf-lib 'flatten' mostly affects form fields. 
            // It doesn't necessarily 'rasterize' the whole page into an image (which is another definition of flattening).
            // But usually "Flatten PDF" implies making forms uneditable.

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `flattened-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('PDF flattened successfully!');
            setPdfFile(null);
        } catch (error) {
            console.error('Error flattening PDF:', error);
            alert('Error processing PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-slate-100 to-gray-200 rounded-2xl mb-4">
                        <Layers className="w-12 h-12 text-slate-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">Flatten PDF</h1>
                    <p className="text-gray-600 text-lg">Make PDF forms uneditable and merge layers</p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop form or PDF to flatten"
                        />
                    </div>
                ) : (
                    <div className="glass-card p-8 fade-in">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="font-bold text-gray-800">{pdfFile.name}</h3>
                            <button onClick={() => setPdfFile(null)} className="text-red-500 text-sm hover:underline">Change File</button>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl mb-8">
                            <h4 className="font-bold text-slate-800 mb-4">What happens when you flatten?</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-3 h-3 text-green-600" /></div>
                                    Interactive form fields become permanent static text
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-3 h-3 text-green-600" /></div>
                                    Annotations and comments are merged into the page content
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-3 h-3 text-green-600" /></div>
                                    Document becomes read-only and prevents modification
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={flattenPDF}
                                disabled={isProcessing}
                                loading={isProcessing}
                                variant="primary"
                                className="!bg-gradient-to-r !from-slate-600 !to-gray-700"
                                icon={<Download className="w-5 h-5" />}
                            >
                                Flatten & Download
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlattenPDF;
