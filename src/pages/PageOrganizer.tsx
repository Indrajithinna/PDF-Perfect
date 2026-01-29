import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Download, RotateCw, Trash2, Copy, Plus, Move } from 'lucide-react';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';
import { validateFileSize } from '../utils/fileUtils';

interface PageInfo {
    id: string;
    pageNumber: number;
    rotation: number;
    thumbnail: string;
}

const PageOrganizer: React.FC = () => {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
    const [draggedPage, setDraggedPage] = useState<string | null>(null);

    const handleFilesSelected = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            const MAX_SIZE_MB = 100;

            if (!validateFileSize(file, MAX_SIZE_MB)) {
                alert(`File ${file.name} exceeds the ${MAX_SIZE_MB}MB limit.`);
                return;
            }

            setPdfFile(files[0]);
            loadPDFPages(files[0]);
        }
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
        setPages([]);
        setSelectedPages(new Set());
    };

    const loadPDFPages = async (file: File) => {
        setIsProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();

            const pageInfos: PageInfo[] = [];
            for (let i = 0; i < pageCount; i++) {
                pageInfos.push({
                    id: `page-${i}-${Date.now()}`,
                    pageNumber: i,
                    rotation: 0,
                    thumbnail: '', // In a real implementation, you'd generate thumbnails
                });
            }

            setPages(pageInfos);
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const rotatePage = (pageId: string, direction: 'left' | 'right') => {
        setPages(pages.map(page => {
            if (page.id === pageId) {
                const rotationChange = direction === 'right' ? 90 : -90;
                return { ...page, rotation: (page.rotation + rotationChange) % 360 };
            }
            return page;
        }));
    };

    const deletePage = (pageId: string) => {
        if (pages.length === 1) {
            alert('Cannot delete the last page');
            return;
        }
        setPages(pages.filter(page => page.id !== pageId));
        setSelectedPages(prev => {
            const newSet = new Set(prev);
            newSet.delete(pageId);
            return newSet;
        });
    };

    const duplicatePage = (pageId: string) => {
        const pageIndex = pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
            const pageToDuplicate = pages[pageIndex];
            const newPage = {
                ...pageToDuplicate,
                id: `page-${Date.now()}-${Math.random()}`,
            };
            const newPages = [...pages];
            newPages.splice(pageIndex + 1, 0, newPage);
            setPages(newPages);
        }
    };

    const addBlankPage = () => {
        const newPage: PageInfo = {
            id: `blank-${Date.now()}`,
            pageNumber: -1, // Indicates blank page
            rotation: 0,
            thumbnail: '',
        };
        setPages([...pages, newPage]);
    };

    const togglePageSelection = (pageId: string) => {
        setSelectedPages(prev => {
            const newSet = new Set(prev);
            if (newSet.has(pageId)) {
                newSet.delete(pageId);
            } else {
                newSet.add(pageId);
            }
            return newSet;
        });
    };

    const deleteSelectedPages = () => {
        if (selectedPages.size === pages.length) {
            alert('Cannot delete all pages');
            return;
        }
        setPages(pages.filter(page => !selectedPages.has(page.id)));
        setSelectedPages(new Set());
    };

    const handleDragStart = (pageId: string) => {
        setDraggedPage(pageId);
    };

    const handleDragOver = (e: React.DragEvent, pageId: string) => {
        e.preventDefault();
        if (draggedPage && draggedPage !== pageId) {
            const draggedIndex = pages.findIndex(p => p.id === draggedPage);
            const targetIndex = pages.findIndex(p => p.id === pageId);

            if (draggedIndex !== -1 && targetIndex !== -1) {
                const newPages = [...pages];
                const [removed] = newPages.splice(draggedIndex, 1);
                newPages.splice(targetIndex, 0, removed);
                setPages(newPages);
            }
        }
    };

    const handleDragEnd = () => {
        setDraggedPage(null);
    };

    const savePDF = async () => {
        if (!pdfFile || pages.length === 0) {
            alert('No pages to save');
            return;
        }

        setIsProcessing(true);
        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const originalPdf = await PDFDocument.load(arrayBuffer);
            const newPdf = await PDFDocument.create();

            for (const page of pages) {
                if (page.pageNumber === -1) {
                    // Add blank page
                    newPdf.addPage();
                    // Optionally set size
                } else {
                    // Copy page from original
                    const [copiedPage] = await newPdf.copyPages(originalPdf, [page.pageNumber]);

                    // Apply rotation
                    if (page.rotation !== 0) {
                        copiedPage.setRotation(degrees(page.rotation));
                    }

                    newPdf.addPage(copiedPage);
                }
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `organized-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);

            alert('PDF organized successfully!');
        } catch (error) {
            console.error('Error saving PDF:', error);
            alert('Error saving PDF. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 fade-in">
                    <div className="inline-block p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-4">
                        <Move className="w-12 h-12 text-orange-600" />
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-4">PDF Page Organizer</h1>
                    <p className="text-white text-lg">
                        Reorder, rotate, delete, and manage your PDF pages visually
                    </p>
                </div>

                {/* File Upload */}
                {!pdfFile && (
                    <div className="glass-card p-8 mb-6 scale-in">
                        <FileUploader
                            onFilesSelected={handleFilesSelected}
                            accept={{ 'application/pdf': ['.pdf'] }}
                            multiple={false}
                            selectedFiles={[]}
                            title="Drop your PDF file here"
                            description="or click to browse"
                        />
                    </div>
                )}

                {/* Toolbar */}
                {pdfFile && pages.length > 0 && (
                    <div className="glass-card p-6 mb-6 fade-in">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {pages.length} Page{pages.length !== 1 ? 's' : ''}
                                    {selectedPages.size > 0 && ` (${selectedPages.size} selected)`}
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={addBlankPage}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Blank
                                </button>

                                {selectedPages.size > 0 && (
                                    <button
                                        onClick={deleteSelectedPages}
                                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Selected
                                    </button>
                                )}

                                <button
                                    onClick={handleRemoveFile}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Upload New PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Grid */}
                {pages.length > 0 && (
                    <div className="glass-card p-8 mb-6 fade-in">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {pages.map((page, index) => (
                                <div
                                    key={page.id}
                                    draggable
                                    onDragStart={() => handleDragStart(page.id)}
                                    onDragOver={(e) => handleDragOver(e, page.id)}
                                    onDragEnd={handleDragEnd}
                                    className={`group relative bg-white rounded-xl border-2 transition-all duration-300 cursor-move hover:shadow-xl ${selectedPages.has(page.id)
                                        ? 'border-purple-500 shadow-lg scale-105'
                                        : 'border-gray-200 hover:border-purple-300'
                                        } ${draggedPage === page.id ? 'opacity-50' : ''}`}
                                >
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-2 left-2 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedPages.has(page.id)}
                                            onChange={() => togglePageSelection(page.id)}
                                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    {/* Page Number Badge */}
                                    <div className="absolute top-2 right-2 z-10 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-xs font-bold shadow-lg">
                                        {page.pageNumber === -1 ? 'Blank' : index + 1}
                                    </div>

                                    {/* Page Preview */}
                                    <div
                                        className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 rounded-t-xl flex items-center justify-center overflow-hidden"
                                        style={{ transform: `rotate(${page.rotation}deg)` }}
                                    >
                                        <div className="text-center p-4">
                                            <div className="text-6xl font-bold text-gray-300 mb-2">
                                                {page.pageNumber === -1 ? '📄' : index + 1}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {page.pageNumber === -1 ? 'Blank Page' : `Page ${page.pageNumber + 1}`}
                                            </div>
                                            {page.rotation !== 0 && (
                                                <div className="text-xs text-purple-600 font-semibold mt-1">
                                                    {page.rotation}° rotated
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-3 flex items-center justify-center gap-2 border-t border-gray-200">
                                        <button
                                            onClick={() => rotatePage(page.id, 'left')}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn"
                                            title="Rotate Left"
                                        >
                                            <RotateCw className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600 transform scale-x-[-1]" />
                                        </button>
                                        <button
                                            onClick={() => rotatePage(page.id, 'right')}
                                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group/btn"
                                            title="Rotate Right"
                                        >
                                            <RotateCw className="w-4 h-4 text-gray-600 group-hover/btn:text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => duplicatePage(page.id)}
                                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group/btn"
                                            title="Duplicate"
                                        >
                                            <Copy className="w-4 h-4 text-gray-600 group-hover/btn:text-green-600" />
                                        </button>
                                        <button
                                            onClick={() => deletePage(page.id)}
                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group/btn"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-gray-600 group-hover/btn:text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Save Button */}
                {pages.length > 0 && (
                    <div className="flex justify-center fade-in">
                        <Button
                            onClick={savePDF}
                            disabled={isProcessing}
                            loading={isProcessing}
                            variant="primary"
                            size="lg"
                            icon={<Download className="w-5 h-5" />}
                        >
                            Save Organized PDF
                        </Button>
                    </div>
                )}

                {/* Info Section */}
                <div className="glass-card p-6 mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3">How to use:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        <li>Upload your PDF file</li>
                        <li>Drag and drop pages to reorder them</li>
                        <li>Use rotation buttons to rotate individual pages</li>
                        <li>Click duplicate to copy a page</li>
                        <li>Click delete to remove unwanted pages</li>
                        <li>Add blank pages where needed</li>
                        <li>Select multiple pages using checkboxes for batch operations</li>
                        <li>Download your organized PDF</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default PageOrganizer;
