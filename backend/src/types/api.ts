export interface ApiResponse<T = any> {
    error?: {
        message: string;
        code?: string;
        statusCode: number;
    };
    data?: T;
}

export interface JobStatus {
    id: string;
    state: 'active' | 'completed' | 'failed' | 'delayed' | 'waiting';
    progress: number;
    result?: any;
    downloadUrl?: string | null;
}

export interface UploadResponse {
    jobId: string;
    fileId: string;
}
