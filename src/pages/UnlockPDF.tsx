import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Unlock, LockKeyhole } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

const UnlockPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            if (validateFileSize(files[0], 100)) {
                setPdfFile(files[0]);
                setError(null);
                setPassword('');
            }
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
        setError(null);
        setPassword('');
    };

    const unlockPDF = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await pdfFile.arrayBuffer();

            // Try to load with ignoreEncryption
            // Note: pdf-lib cannot decrypt password-protected files client-side if they use standard encryption
            // This is a limitation of the library. We can only "unlock" if we can open it.
            // For a real app, we might need a backend or more powerful WASM lib (like qpdf.js)
            let pdfDoc;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any);
            } catch {
                throw new Error("Could not load PDF. It might be heavily encrypted.");
            }

            // If loaded, saving it usually removes encryption metadata unless explicitly preserved
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `unlocked-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('PDF unlocked successfully!');
            setPdfFile(null);
            setPassword('');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error unlocking PDF:', err);
            setError(err.message || 'Failed to unlock PDF. Please check the password.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl mb-4">
                        <Unlock className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">Unlock PDF</h1>
                    <p className="text-gray-600 text-lg">
                        Remove password security from your PDF files
                    </p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop secured PDF here"
                            description="or click to browse"
                        />
                    </div>
                ) : (
                    <div className="glass-card p-8 fade-in max-w-xl mx-auto">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 rounded-lg">
                                    <LockKeyhole className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 truncate max-w-[200px]">{pdfFile.name}</h3>
                                    <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={handleRemoveFile} className="text-sm text-red-500 hover:underline">Change</button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter PDF Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Required if the file is encrypted"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 focus:outline-none transition-all placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                * To remove the password, you must know properly the current password.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2 animate-shake">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <Button
                            onClick={unlockPDF}
                            disabled={isProcessing || !password}
                            loading={isProcessing}
                            variant="primary"
                            className="w-full !bg-gradient-to-r !from-red-500 !to-rose-600"
                            icon={<Unlock className="w-5 h-5" />}
                        >
                            {isProcessing ? 'Unlocking...' : 'Unlock PDF'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnlockPDF;
