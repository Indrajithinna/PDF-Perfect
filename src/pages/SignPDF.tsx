import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import ReactSignatureCanvas from 'react-signature-canvas';
import Draggable from 'react-draggable';
import { Download, Upload, PenTool, Image as ImageIcon, Type, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Configure PDF.js worker
// Using CDN for simplicity and reliability in this context
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface SignatureElement {
    id: string;
    type: 'draw' | 'image' | 'text';
    content: string; // dataURL for images/drawings, text for text
    x: number;
    y: number;
    page: number;
    width: number;
    height: number;
}

const SignPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.0);
    const [elements, setElements] = useState<SignatureElement[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal states
    const [showDrawModal, setShowDrawModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [textInput, setTextInput] = useState('');

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sigPadRef = useRef<ReactSignatureCanvas>(null);

    // Initial PDF Load
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const doc = await loadingTask.promise;
            setPdfDoc(doc);
            setTotalPages(doc.numPages);
            setCurrentPage(1);
            setElements([]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    // Render Page
    useEffect(() => {
        const renderPage = async () => {
            if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

            const page = await pdfDoc.getPage(currentPage);

            // Calculate scale to fit container width
            const containerWidth = containerRef.current.clientWidth;
            const unscaledViewport = page.getViewport({ scale: 1 });
            const newScale = containerWidth / unscaledViewport.width; // Fit width
            // Determine best scale (max 1.5 to avoid pixelation, min to fit)
            const finalScale = Math.min(newScale, 1.5);

            setScale(finalScale);

            const viewport = page.getViewport({ scale: finalScale });
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                await page.render(renderContext as any).promise;
            }
        };

        renderPage();
    }, [pdfDoc, currentPage]);

    // Handle Adding Elements
    const addDrawing = () => {
        if (sigPadRef.current) {
            const dataUrl = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
            addElement('draw', dataUrl);
            setShowDrawModal(false);
        }
    };

    const addText = () => {
        if (textInput.trim()) {
            // Convert text to image for consistent handling
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.font = '48px "Dancing Script", cursive, sans-serif';
                const width = ctx.measureText(textInput).width + 20;
                canvas.width = width;
                canvas.height = 60;
                ctx.font = '48px "Dancing Script", cursive, sans-serif'; // Re-set after resize
                ctx.fillStyle = 'black';
                ctx.fillText(textInput, 10, 50);

                addElement('text', canvas.toDataURL('image/png'));
                setShowTypeModal(false);
                setTextInput('');
            }
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    addElement('image', event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addElement = (type: 'draw' | 'image' | 'text', content: string) => {
        // Create new image to get dimensions
        const img = new Image();
        img.onload = () => {
            // reasonable default size based on type
            let width = 150;
            let height = (img.height / img.width) * width;

            setElements(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                type,
                content,
                x: 50, // Default position
                y: 50,
                page: currentPage,
                width,
                height
            }]);
        };
        img.src = content;
    };

    const removeElement = (id: string) => {
        setElements(prev => prev.filter(el => el.id !== id));
    };

    const updateElementPosition = (id: string, x: number, y: number) => {
        setElements(prev => prev.map(el =>
            el.id === id ? { ...el, x, y } : el
        ));
    };

    // Save Final PDF
    const savePDF = async () => {
        if (!pdfFile || isProcessing) return;
        setIsProcessing(true);

        try {
            const pdfBytes = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            for (const el of elements) {
                const imageBytes = await fetch(el.content).then(res => res.arrayBuffer());
                let image;
                if (el.content.startsWith('data:image/png')) {
                    image = await pdfDoc.embedPng(imageBytes);
                } else {
                    image = await pdfDoc.embedJpg(imageBytes); // Fallback assumption
                }

                const page = pages[el.page - 1];
                const { height: pageHeight } = page.getSize();

                // Convert screen coordinates to PDF coordinates
                // PDF Coordinates: Origin is Bottom-Left
                // Screen: Origin is Top-Left
                // Need to account for the scale we displayed the PDF at

                // Actual scale factor = PDF Point Width / Display Width
                // But we can invert: Display Scale = Display Width / PDF Point Width
                // We stored 'scale' which is (Display / PDF Viewport scale 1)

                // Let's re-calculate precise scale for this page
                // Let's re-calculate precise scale for this page
                // We need pdfjs page info for viewport calculation actually
                // Better approach:
                // x_pdf = x_screen / scale
                // y_pdf = pageHeight - (y_screen / scale) - (imageHeight_pdf)

                const pdfX = el.x / scale;
                const pdfY = pageHeight - ((el.y / scale) + (el.height / scale));
                const pdfWidth = el.width / scale;
                const pdfHeight = el.height / scale;

                page.drawImage(image, {
                    x: pdfX,
                    y: pdfY,
                    width: pdfWidth,
                    height: pdfHeight,
                });
            }

            const savedPdfBytes = await pdfDoc.save();
            const blob = new Blob([savedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `signed-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error saving PDF:', error);
            alert('Error saving PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 fade-in">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Sign PDF</h1>
                    <p className="text-gray-600 text-lg">
                        Add signatures, images, and text to your PDF documents
                    </p>
                </div>

                {!pdfFile ? (
                    <div className="glass-card p-12 mb-6">
                        <div
                            {...getRootProps()}
                            className={`dropzone ${isDragActive ? 'active' : ''}`}
                        >
                            <input {...getInputProps()} />
                            <Upload className="w-16 h-16 text-violet-500 mx-auto mb-4" />
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                {isDragActive ? 'Drop PDF file here' : 'Drag & drop a PDF file here'}
                            </p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="glass-card p-4">
                                <h3 className="font-bold text-gray-800 mb-4">Tools</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowDrawModal(true)}
                                        className="w-full flex items-center p-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                    >
                                        <PenTool className="w-5 h-5 mr-3" />
                                        <span className="font-semibold">Draw Signature</span>
                                    </button>
                                    <button
                                        onClick={() => setShowTypeModal(true)}
                                        className="w-full flex items-center p-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors"
                                    >
                                        <Type className="w-5 h-5 mr-3" />
                                        <span className="font-semibold">Type Signature</span>
                                    </button>
                                    <label className="w-full flex items-center p-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors cursor-pointer">
                                        <ImageIcon className="w-5 h-5 mr-3" />
                                        <span className="font-semibold">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="glass-card p-4">
                                <h3 className="font-bold text-gray-800 mb-4">Actions</h3>
                                <button
                                    onClick={savePDF}
                                    disabled={isProcessing}
                                    className="btn-primary w-full"
                                >
                                    {isProcessing ? 'Processing...' : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Signed PDF
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setPdfFile(null)}
                                    className="btn-secondary w-full mt-3"
                                >
                                    Change PDF
                                </button>
                            </div>
                        </div>

                        {/* Main Editor */}
                        <div className="lg:col-span-3">
                            <div className="glass-card p-4 relative min-h-[600px] flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-800">
                                {/* Page Navigation */}
                                <div className="absolute top-4 left-0 right-0 flex justify-center items-center space-x-4 z-10 pointer-events-none">
                                    <div className="bg-white/90 dark:bg-slate-900/90 shadow-lg rounded-full px-4 py-2 flex items-center space-x-4 pointer-events-auto backdrop-blur-sm">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full disabled:opacity-30"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                        </button>
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full disabled:opacity-30"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Canvas Container */}
                                <div
                                    ref={containerRef}
                                    className="relative shadow-2xl mt-12 mb-4 max-w-full"
                                    style={{ width: '100%', overflow: 'hidden' }}
                                >
                                    <canvas ref={canvasRef} className="block mx-auto" />

                                    {/* Draggable Overlays */}
                                    {elements.filter(el => el.page === currentPage).map(el => (
                                        <Draggable
                                            key={el.id}
                                            defaultPosition={{ x: el.x, y: el.y }}
                                            onStop={(_, data) => updateElementPosition(el.id, data.x, data.y)}
                                            bounds="parent"
                                        >
                                            <div
                                                className="absolute top-0 left-0 cursor-move border-2 border-transparent hover:border-violet-500 group"
                                                style={{ width: el.width, height: el.height }}
                                            >
                                                <img
                                                    src={el.content}
                                                    alt="Signature"
                                                    className="w-full h-full object-contain pointer-events-none"
                                                />
                                                <button
                                                    onClick={() => removeElement(el.id)}
                                                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>

                                                {/* Resize handle (Visual only for now for simplicity, can extend) */}
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-violet-500 rounded-full opacity-0 group-hover:opacity-100 cursor-se-resize" />
                                            </div>
                                        </Draggable>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Draw Modal */}
                {showDrawModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-6 w-full max-w-lg bg-white">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Draw Your Signature</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white mb-4 overflow-hidden">
                                <ReactSignatureCanvas
                                    ref={sigPadRef}
                                    canvasProps={{
                                        className: 'w-full h-64 block',
                                        style: { width: '100%', height: '256px' }
                                    }}
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => sigPadRef.current?.clear()}
                                    className="btn-secondary flex-1"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={addDrawing}
                                    className="btn-primary flex-1"
                                >
                                    Use Signature
                                </button>
                            </div>
                            <button
                                onClick={() => setShowDrawModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Type Modal */}
                {showTypeModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="glass-card p-6 w-full max-w-lg bg-white">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Type Your Signature</h3>
                            <input
                                type="text"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-violet-500 focus:outline-none mb-6 font-[cursive] text-2xl"
                                style={{ fontFamily: '"Dancing Script", cursive' }}
                            />
                            <button
                                onClick={addText}
                                className="btn-primary w-full"
                            >
                                Use Signature
                            </button>
                            <button
                                onClick={() => setShowTypeModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignPDF;
