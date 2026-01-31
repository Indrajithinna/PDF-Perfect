import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileText, Save, Info } from 'lucide-react';
import { validateFileSize } from '../utils/fileUtils';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

const EditMetadata: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        title: '',
        author: '',
        subject: '',
        keywords: '',
        creator: '',
        producer: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFilesSelected = async (files: File[]) => {
        if (files.length > 0 && validateFileSize(files[0], 100)) {
            const file = files[0];
            setPdfFile(file);

            // Load existing metadata
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);

                setMetadata({
                    title: pdfDoc.getTitle() || '',
                    author: pdfDoc.getAuthor() || '',
                    subject: pdfDoc.getSubject() || '',
                    keywords: pdfDoc.getKeywords() || '',
                    creator: pdfDoc.getCreator() || '',
                    producer: pdfDoc.getProducer() || ''
                });
            } catch (error) {
                console.error("Error reading metadata", error);
            }
        }
    };

    const updateMetadata = async () => {
        if (!pdfFile) return;

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `metadata-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('Metadata updated successfully!');
            setPdfFile(null);
        } catch (error) {
            console.error('Error updating metadata:', error);
            alert('Error processing PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (field: keyof typeof metadata, value: string) => {
        setMetadata(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-2xl mb-4">
                        <FileText className="w-12 h-12 text-purple-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">Edit PDF Metadata</h1>
                    <p className="text-gray-600 text-lg">Modify title, author, and other document properties</p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            title="Drop PDF to edit metadata"
                        />
                    </div>
                ) : (
                    <div className="glass-card p-8 fade-in">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="font-bold text-gray-800">{pdfFile.name}</h3>
                            <button onClick={() => setPdfFile(null)} className="text-red-500 text-sm hover:underline">Change File</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={metadata.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                                <input
                                    type="text"
                                    value={metadata.author}
                                    onChange={(e) => handleChange('author', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={metadata.subject}
                                    onChange={(e) => handleChange('subject', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Keywords</label>
                                <input
                                    type="text"
                                    value={metadata.keywords}
                                    onChange={(e) => handleChange('keywords', e.target.value)}
                                    placeholder="Comma separated (e.g. invoice, 2024, finance)"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Creator App</label>
                                <input
                                    type="text"
                                    value={metadata.creator}
                                    onChange={(e) => handleChange('creator', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Producer</label>
                                <input
                                    type="text"
                                    value={metadata.producer}
                                    onChange={(e) => handleChange('producer', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg mb-6 flex gap-3 text-sm text-blue-700">
                            <Info className="w-5 h-5 flex-shrink-0" />
                            <p>Modifying metadata helps in SEO and document organization but does not change the visual content of the PDF.</p>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={updateMetadata}
                                disabled={isProcessing}
                                loading={isProcessing}
                                variant="primary"
                                className="!bg-gradient-to-r !from-purple-600 !to-fuchsia-600"
                                icon={<Save className="w-5 h-5" />}
                            >
                                Save Metadata
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditMetadata;
