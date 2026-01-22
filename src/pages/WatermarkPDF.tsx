import React, { useState, useRef } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { Download, Droplet, Type, Image as ImageIcon, RotateCw } from 'lucide-react';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';

type WatermarkType = 'text' | 'image';
type Position = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';

const WatermarkPDF: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
    const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
    const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
    const [fontSize, setFontSize] = useState(48);
    const [opacity, setOpacity] = useState(0.3);
    const [rotation, setRotation] = useState(45);
    const [position, setPosition] = useState<Position>('center');
    const [color, setColor] = useState('#FF0000');
    const [isProcessing, setIsProcessing] = useState(false);
    const [tiled, setTiled] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            setPdfFile(files[0]);
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setWatermarkImage(e.target.files[0]);
        }
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 1, g: 0, b: 0 };
    };

    const getPosition = (pageWidth: number, pageHeight: number, textWidth: number, textHeight: number) => {
        const positions = {
            'center': { x: (pageWidth - textWidth) / 2, y: (pageHeight - textHeight) / 2 },
            'top-left': { x: 50, y: pageHeight - textHeight - 50 },
            'top-right': { x: pageWidth - textWidth - 50, y: pageHeight - textHeight - 50 },
            'bottom-left': { x: 50, y: 50 },
            'bottom-right': { x: pageWidth - textWidth - 50, y: 50 },
            'custom': { x: pageWidth / 2, y: pageHeight / 2 }
        };
        return positions[position];
    };

    const addWatermark = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file');
            return;
        }

        if (watermarkType === 'text' && !watermarkText) {
            alert('Please enter watermark text');
            return;
        }

        if (watermarkType === 'image' && !watermarkImage) {
            alert('Please select a watermark image');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const rgbColor = hexToRgb(color);

            if (watermarkType === 'text') {
                for (const page of pages) {
                    const { width, height } = page.getSize();
                    const textWidth = watermarkText.length * fontSize * 0.6;
                    const textHeight = fontSize;

                    if (tiled) {
                        // Add tiled watermark
                        const xSpacing = 200;
                        const ySpacing = 150;
                        for (let x = 0; x < width; x += xSpacing) {
                            for (let y = 0; y < height; y += ySpacing) {
                                page.drawText(watermarkText, {
                                    x,
                                    y,
                                    size: fontSize,
                                    color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
                                    opacity: opacity,
                                    rotate: degrees(rotation),
                                });
                            }
                        }
                    } else {
                        // Add single watermark
                        const pos = getPosition(width, height, textWidth, textHeight);
                        page.drawText(watermarkText, {
                            x: pos.x,
                            y: pos.y,
                            size: fontSize,
                            color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
                            opacity: opacity,
                            rotate: degrees(rotation),
                        });
                    }
                }
            } else if (watermarkType === 'image' && watermarkImage) {
                const imageBytes = await watermarkImage.arrayBuffer();
                let image;

                if (watermarkImage.type === 'image/png') {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (watermarkImage.type === 'image/jpeg' || watermarkImage.type === 'image/jpg') {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else {
                    throw new Error('Unsupported image format. Please use PNG or JPG.');
                }

                const imageDims = image.scale(0.5);

                for (const page of pages) {
                    const { width, height } = page.getSize();

                    if (tiled) {
                        const xSpacing = imageDims.width + 100;
                        const ySpacing = imageDims.height + 100;
                        for (let x = 0; x < width; x += xSpacing) {
                            for (let y = 0; y < height; y += ySpacing) {
                                page.drawImage(image, {
                                    x,
                                    y,
                                    width: imageDims.width,
                                    height: imageDims.height,
                                    opacity: opacity,
                                    rotate: degrees(rotation),
                                });
                            }
                        }
                    } else {
                        const pos = getPosition(width, height, imageDims.width, imageDims.height);
                        page.drawImage(image, {
                            x: pos.x,
                            y: pos.y,
                            width: imageDims.width,
                            height: imageDims.height,
                            opacity: opacity,
                            rotate: degrees(rotation),
                        });
                    }
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `watermarked-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('Watermark added successfully!');
            setPdfFile(null);
        } catch (error) {
            console.error('Error adding watermark:', error);
            alert('Error adding watermark. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-4">
                        <Droplet className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">PDF Watermark Tool</h1>
                    <p className="text-white text-lg">
                        Add text or image watermarks to protect your PDFs
                    </p>
                </div>

                {/* Watermark Type Selector */}
                <div className="glass-card p-6 mb-6 fade-in">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setWatermarkType('text')}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${watermarkType === 'text'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Type className="w-5 h-5" />
                            Text Watermark
                        </button>
                        <button
                            onClick={() => setWatermarkType('image')}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${watermarkType === 'image'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <ImageIcon className="w-5 h-5" />
                            Image Watermark
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - File Upload */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 scale-in">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Upload PDF</h3>
                            <FileUploader
                                onFilesSelected={handleFilesSelected}
                                accept={{ 'application/pdf': ['.pdf'] }}
                                multiple={false}
                                selectedFiles={pdfFile ? [pdfFile] : []}
                                onRemoveFile={handleRemoveFile}
                                title="Drop PDF here"
                                description="or click to browse"
                            />
                        </div>

                        {/* Watermark Content */}
                        <div className="glass-card p-8 scale-in">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Watermark Content</h3>

                            {watermarkType === 'text' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Watermark Text
                                    </label>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        placeholder="Enter watermark text"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Watermark Image
                                    </label>
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => imageInputRef.current?.click()}
                                        className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors flex items-center justify-center gap-2 text-gray-700 hover:text-purple-600"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        {watermarkImage ? watermarkImage.name : 'Choose Image (PNG/JPG)'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Settings */}
                    <div className="glass-card p-8 scale-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Watermark Settings</h3>

                        <div className="space-y-6">
                            {/* Position */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Position
                                </label>
                                <select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value as Position)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    <option value="center">Center</option>
                                    <option value="top-left">Top Left</option>
                                    <option value="top-right">Top Right</option>
                                    <option value="bottom-left">Bottom Left</option>
                                    <option value="bottom-right">Bottom Right</option>
                                </select>
                            </div>

                            {/* Font Size (Text only) */}
                            {watermarkType === 'text' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Font Size: {fontSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="120"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>
                            )}

                            {/* Color (Text only) */}
                            {watermarkType === 'text' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Color
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="h-12 w-20 rounded-xl cursor-pointer border-2 border-gray-300"
                                        />
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => setColor(e.target.value)}
                                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-mono"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Opacity */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Opacity: {Math.round(opacity * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={opacity}
                                    onChange={(e) => setOpacity(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Rotation */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <RotateCw className="w-4 h-4" />
                                    Rotation: {rotation}°
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Tiled */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={tiled}
                                        onChange={(e) => setTiled(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-semibold">
                                        Tile watermark across page
                                    </span>
                                </label>
                            </div>

                            {/* Preview */}
                            <div className="mt-6 p-6 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl border-2 border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">Preview:</p>
                                <div className="relative h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                                    <div
                                        style={{
                                            color: color,
                                            opacity: opacity,
                                            transform: `rotate(${rotation}deg)`,
                                            fontSize: `${fontSize / 4}px`,
                                        }}
                                        className="font-bold transition-all duration-300"
                                    >
                                        {watermarkType === 'text' ? watermarkText : 'Image'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                {pdfFile && (
                    <div className="mt-6 flex justify-center fade-in">
                        <Button
                            onClick={addWatermark}
                            disabled={isProcessing}
                            loading={isProcessing}
                            variant="primary"
                            size="lg"
                            icon={<Download className="w-5 h-5" />}
                        >
                            Add Watermark & Download
                        </Button>
                    </div>
                )}

                {/* Info Section */}
                <div className="glass-card p-6 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">How to use:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        <li>Upload your PDF file</li>
                        <li>Choose text or image watermark</li>
                        <li>Enter watermark text or select an image</li>
                        <li>Customize position, size, color, opacity, and rotation</li>
                        <li>Enable tiling for repeated watermarks</li>
                        <li>Download your watermarked PDF</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default WatermarkPDF;
