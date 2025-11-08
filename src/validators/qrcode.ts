export interface QRCodeRequest {
    data: string;
    size?: number;
    format?: 'svg' | 'png';
}

export interface QRCodeResponse {
    qrCodeUrl: string;
    data: string;
    format: string;
    size: number;
    createdAt: string;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const MAX_DATA_LENGTH = 2000;
export const MIN_SIZE = 150;
export const MAX_SIZE = 1000;
export const DEFAULT_SIZE = 200;

export function validateQRRequest(data: any): ValidationResult {
    if (!data || typeof data !== 'object') {
        return { isValid: false, error: 'Invalid request body' };
    }

    if (!data.data || typeof data.data !== 'string') {
        return { isValid: false, error: "Missing required field: 'data'" };
    }

    if (data.data.length > MAX_DATA_LENGTH) {
        return {
            isValid: false,
            error: `Data exceeds maximum length of ${MAX_DATA_LENGTH} characters`,
        };
    }

    const size = data.size || DEFAULT_SIZE;
    if (typeof size !== 'number' || size < MIN_SIZE || size > MAX_SIZE) {
        return {
            isValid: false,
            error: `Size must be between ${MIN_SIZE} and ${MAX_SIZE}`,
        };
    }

    const format = data.format || 'svg';
    if (format !== 'svg' && format !== 'png') {
        return {
            isValid: false,
            error: "Format must be either 'svg' or 'png'",
        };
    }

    return { isValid: true };
}
