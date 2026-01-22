import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

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
          border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
          ${isDragActive && !isDragReject ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-gray-50'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:bg-purple-25'}
        `}
            >
                <input {...getInputProps()} />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragActive ? 'text-purple-600' : 'text-gray-400'}`} />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                    {isDragActive ? 'Drop files here' : title}
                </p>
                <p className="text-sm text-gray-500">{description}</p>
                {maxSize && (
                    <p className="text-xs text-gray-400 mt-2">
                        Maximum file size: {formatFileSize(maxSize)}
                    </p>
                )}
            </div>

            {selectedFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-800">
                        Selected Files ({selectedFiles.length})
                    </h4>
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors"
                        >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <File className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            {onRemoveFile && (
                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="ml-4 p-2 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                                    aria-label="Remove file"
                                >
                                    <X className="w-5 h-5 text-red-500" />
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
