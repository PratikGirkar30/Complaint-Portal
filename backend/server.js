import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaint.js';

dotenv.config();

const app = express();
connectDB();
app.use(express.json()); // to parse JSON request body
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

console.log("Mongo UR:", process.env.MONGO_URI);