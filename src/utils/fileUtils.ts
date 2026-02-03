/**
 * Utility functions for file handling and processing
 */

/**
 * Format file size in human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Validate file size
 * @param file File object to check
 * @param maxSizeMB Maximum allowed size in Megabytes
 * @returns true if file is within limit, false otherwise
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Validate if file is a valid PDF
 */
export const isValidPDF = (file: File): boolean => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};

/**
 * Validate if file is a valid image
 */
export const isValidImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    return validTypes.includes(file.type);
};

/**
 * Validate if file is a valid document
 */
export const isValidDocument = (file: File): boolean => {
    const validExtensions = ['.docx', '.txt'];
    return validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
};

/**
 * Generate unique ID for files
 */
export const generateFileId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Download file from blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Read file as ArrayBuffer
 */
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Read file as text
 */
export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
    });
};

/**
 * Calculate compression ratio
 */
export const calculateCompressionRatio = (originalSize: number, compressedSize: number): number => {
    if (originalSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename: string): string => {
    return filename.replace(/[^a-z0-9.-]/gi, '_').toLowerCase();
};

/**
 * Read file as Data URL (base64)
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

/**
 * Debounce function to limit rate of execution
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

