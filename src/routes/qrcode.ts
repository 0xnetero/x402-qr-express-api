import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import {
    validateQRRequest,
    QRCodeRequest,
    QRCodeResponse,
    DEFAULT_SIZE,
} from '../validators/qrcode';

const router = Router();

// Generate QR code endpoint
router.post('/generate', async (req: Request, res: Response) => {
    try {
        const requestData: QRCodeRequest = req.body;

        // Validate request
        const validation = validateQRRequest(requestData);
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Validation error',
                message: validation.error,
            });
        }

        const data = requestData.data;
        const size = requestData.size || DEFAULT_SIZE;
        const format = (requestData.format || 'svg').toLowerCase();

        // Calculate scale for QR code
        const scale = Math.max(1, Math.floor(size / 40));

        let qrCodeUrl: string;

        if (format === 'svg') {
            // Generate SVG QR code as data URI
            const svgString = await QRCode.toString(data, {
                type: 'svg',
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });

            // Convert to data URI
            const base64 = Buffer.from(svgString).toString('base64');
            qrCodeUrl = `data:image/svg+xml;base64,${base64}`;
        } else if (format === 'png') {
            // Generate PNG QR code as data URI
            qrCodeUrl = await QRCode.toDataURL(data, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff',
                },
            });
        } else {
            return res.status(400).json({
                error: 'Invalid format',
                message: "Format must be either 'svg' or 'png'",
            });
        }

        const response: QRCodeResponse = {
            qrCodeUrl,
            data,
            format,
            size,
            createdAt: new Date().toISOString(),
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to generate QR code',
        });
    }
});

// Download QR code endpoint
router.post('/download', async (req: Request, res: Response) => {
    try {
        const requestData: QRCodeRequest = req.body;

        const validation = validateQRRequest(requestData);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }

        const data = requestData.data;
        const size = requestData.size || DEFAULT_SIZE;
        const format = (requestData.format || 'svg').toLowerCase();

        if (format === 'svg') {
            const svgString = await QRCode.toString(data, {
                type: 'svg',
                width: size,
                margin: 2,
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', 'attachment; filename="qrcode.svg"');
            return res.send(svgString);
        } else if (format === 'png') {
            const buffer = await QRCode.toBuffer(data, {
                width: size,
                margin: 2,
            });

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
            return res.send(buffer);
        } else {
            return res.status(400).json({ error: 'Invalid format' });
        }
    } catch (error) {
        console.error('Error downloading QR code:', error);
        return res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Inline SVG endpoint
router.post('/inline-svg', async (req: Request, res: Response) => {
    try {
        const requestData: QRCodeRequest = req.body;

        const validation = validateQRRequest(requestData);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.error });
        }

        const data = requestData.data;
        const size = requestData.size || DEFAULT_SIZE;

        const svgString = await QRCode.toString(data, {
            type: 'svg',
            width: size,
            margin: 2,
        });

        return res.status(200).json({
            svg: svgString,
            data,
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error generating inline SVG:', error);
        return res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

export default router;
