import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import serviceRoutes from './routes/services.js';
import applicationRoutes from './routes/applications.js';
import ticketRoutes from './routes/tickets.js';
import announcementRoutes from './routes/announcements.js';
import faqRoutes from './routes/faqs.js';
import postRoutes from './routes/posts.js';
import questionRoutes from './routes/questions.js';
import notificationRoutes from './routes/notifications.js';
import searchRoutes from './routes/search.js';
import adminRoutes from './routes/admin.js';
import documentRoutes from './routes/documents.js';
import ratingRoutes from './routes/ratings.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'HUMG Portal API' }));

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reports', reportRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Lỗi server' });
});

app.listen(PORT, () => {
  console.log(`🚀 HUMG Portal API running on http://localhost:${PORT}`);
});
