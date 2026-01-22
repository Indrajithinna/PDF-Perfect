import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    maxSize?: number;
    disabled?: boolean;
    selectedFiles?: File[];
    onRemoveFile?: (index: number) => void;
    title?: string;
    description?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
    onFilesSelected,
    accept,
    multiple = true,
    maxSize,
    disabled = false,
    selectedFiles = [],
    onRemoveFile,
    title = 'Drag & drop files here',
    description = 'or click to browse',
}) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesSelected(acceptedFiles);
        },
        [onFilesSelected]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        multiple,
        maxSize,
        disabled,
    });

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
          relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-500 cursor-pointer overflow-hidden
          ${isDragActive && !isDragReject ? 'border-purple-500 bg-purple-50 scale-105' : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-25 hover:shadow-lg'}
        `}
            >
                <input {...getInputProps()} />

                {/* Animated Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-0 transition-opacity duration-500 ${isDragActive ? 'opacity-10' : ''}`}></div>

                {/* Upload Icon */}
                <div className="relative">
                    <Upload className={`w-16 h-16 mx-auto mb-4 transition-all duration-500 ${isDragActive ? 'text-purple-600 scale-110 animate-bounce' : 'text-gray-400'
                        }`} />

                    {isDragActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                <p className="text-lg font-bold text-gray-700 mb-2">
                    {isDragActive ? 'Drop files here' : title}
                </p>
                <p className="text-sm text-gray-500 mb-3">{description}</p>

                {maxSize && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        Maximum file size: {formatFileSize(maxSize)}
                    </p>
                )}

                {/* Supported Formats */}
                {accept && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {Object.keys(accept).map((type, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {type.split('/')[1]?.toUpperCase() || type}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-8 space-y-3 fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Selected Files ({selectedFiles.length})
                        </h4>
                        <span className="text-sm text-gray-500">
                            Total: {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}
                        </span>
                    </div>

                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="group flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 scale-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <File className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <p className="text-xs text-gray-500">
                                            {file.type || 'Unknown type'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {onRemoveFile && (
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="ml-4 p-2 hover:bg-red-50 rounded-lg transition-all duration-300 flex-shrink-0 group/btn"
                                    aria-label="Remove file"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500 group-hover/btn:scale-110 transition-all" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploader;
