import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import qrcodeRoutes from './routes/qrcode';
import { handlePreflight, addCorsHeaders } from './middleware/cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
    })
);

// Custom CORS middleware
app.use(addCorsHeaders);

// Handle preflight requests FIRST (before authentication)
app.use(handlePreflight);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'QR Code Generator API',
    });
});

// QR code routes
app.use('/api/qr-code', qrcodeRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist',
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 QR Code Generator API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
