import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import snailpayRoutes from './routes/snailpay.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/snailpay', snailpayRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'SnailPay Betting API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
