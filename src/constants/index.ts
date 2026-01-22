/**
 * Application constants and configuration
 */

export const APP_CONFIG = {
    name: 'PDF Perfect',
    version: '1.0.0',
    description: 'Professional PDF tools that work offline',
    author: 'PDF Perfect Team',
    repository: 'https://github.com/Indrajithinna/PDF-Perfect',
};

export const FILE_LIMITS = {
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFilesForMerge: 20,
    maxPagesForSplit: 1000,
};

export const SUPPORTED_FORMATS = {
    pdf: ['application/pdf'],
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],
    documents: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ],
};

export const COMPRESSION_LEVELS = {
    low: {
        name: 'Low',
        description: 'Best quality, minimal compression',
        quality: 0.95,
    },
    medium: {
        name: 'Medium',
        description: 'Balanced quality and size',
        quality: 0.85,
    },
    high: {
        name: 'High',
        description: 'Maximum compression, good quality',
        quality: 0.75,
    },
};

export const IMAGE_FORMATS = {
    png: {
        name: 'PNG',
        extension: '.png',
        mimeType: 'image/png',
        description: 'Lossless, larger files',
    },
    jpeg: {
        name: 'JPEG',
        extension: '.jpg',
        mimeType: 'image/jpeg',
        description: 'Compressed, smaller files',
    },
};

export const ROUTES = {
    home: '/',
    merge: '/merge',
    split: '/split',
    compress: '/compress',
    convert: '/convert',
    pdfToImages: '/pdf-to-images',
};

export const COLORS = {
    primary: {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        main: '#667eea',
        dark: '#764ba2',
    },
    secondary: {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        main: '#f093fb',
        dark: '#f5576c',
    },
    success: {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        main: '#4facfe',
        dark: '#00f2fe',
    },
};

export const ANIMATION_DURATION = {
    fast: 200,
    normal: 300,
    slow: 500,
};

export const ERROR_MESSAGES = {
    fileTooBig: 'File size exceeds the maximum limit',
    invalidFileType: 'Invalid file type',
    tooManyFiles: 'Too many files selected',
    processingError: 'An error occurred while processing your file',
    networkError: 'Network error occurred',
};

export const SUCCESS_MESSAGES = {
    fileProcessed: 'File processed successfully',
    downloadStarted: 'Download started',
    operationComplete: 'Operation completed successfully',
};
