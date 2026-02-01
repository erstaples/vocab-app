import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { wordsRouter } from './routes/words';
import { morphemesRouter } from './routes/morphemes';
import { progressRouter } from './routes/progress';
import { usersRouter } from './routes/users';
import { badgesRouter } from './routes/badges';
import { adminRouter } from './routes/admin';
import { aiRouter, initializeAIFromDatabase } from './routes/ai';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/words', wordsRouter);
app.use('/api/morphemes', morphemesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/users', usersRouter);
app.use('/api/badges', badgesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize AI service from stored config
  await initializeAIFromDatabase();
});

export default app;
