/**
 * Type definitions for PDF Perfect application
 */

export interface PDFFile {
    id: string;
    file: File;
    name: string;
    size: number;
    pageCount?: number;
    previewUrl?: string;
}

export interface ProcessingOptions {
    quality?: number;
    compressionLevel?: 'low' | 'medium' | 'high';
    outputFormat?: 'png' | 'jpeg' | 'pdf';
}

export interface MergeOptions {
    files: File[];
    outputName?: string;
}

export interface SplitOptions {
    file: File;
    mode: 'range' | 'individual';
    startPage?: number;
    endPage?: number;
}

export interface CompressOptions {
    file: File;
    level: 'low' | 'medium' | 'high';
}

export interface ConvertOptions {
    files: File[];
    outputFormat: 'pdf';
    quality?: number;
}

export interface PDFToImagesOptions {
    file: File;
    format: 'png' | 'jpeg';
    quality?: number;
}

export interface ProcessingResult {
    success: boolean;
    blob?: Blob;
    blobs?: Blob[];
    error?: string;
    message?: string;
}

export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

export interface AppRoute {
    path: string;
    name: string;
    icon?: React.ReactNode;
    description?: string;
}

export interface ToolCardData {
    icon: React.ReactNode;
    title: string;
    description: string;
    link: string;
    color: string;
}

export interface FeatureData {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type LoadingSize = 'sm' | 'md' | 'lg';
export type CompressionLevel = 'low' | 'medium' | 'high';
export type ImageFormat = 'png' | 'jpeg';
export type SplitMode = 'range' | 'individual';
