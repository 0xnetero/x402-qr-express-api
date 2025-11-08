import { Request, Response, NextFunction } from 'express';

export function handlePreflight(req: Request, res: Response, next: NextFunction) {
    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
        res.header('Access-Control-Max-Age', '3600');
        return res.status(200).json({ status: 'ok' });
    }
    next();
}

export function addCorsHeaders(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    next();
}
