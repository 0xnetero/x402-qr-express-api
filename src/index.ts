import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { paymentMiddleware, Resource } from "x402-express";
import qrcodeRoutes from './routes/qrcode';

const app = express();
const PORT = process.env.PORT || 5000;
const PAY_TO = "0x0c3ECFe71297d5FB873a9e4C5B9d0DFc8D2d9768";
const NETWORK = "base";
const FACILITATOR_URL = "https://x402.org/facilitator" as Resource;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

app.use(
    paymentMiddleware(
        PAY_TO,
        {
            "/api/qr-code/*": {
                // USDC amount in dollars
                price: "$0.001",
                network: NETWORK,
            },
        },
        {
            url: FACILITATOR_URL,
        },
    ),
);

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
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist',
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 QR Code Generator API running on port ${PORT}`);
});
