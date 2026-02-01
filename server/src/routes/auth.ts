import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne, execute } from '../db/pool';
import { authenticate, generateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      throw createError('Email, username, and password are required', 400);
    }

    if (password.length < 8) {
      throw createError('Password must be at least 8 characters', 400);
    }

    // Check if user exists
    const existing = await queryOne(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existing) {
      throw createError('Email or username already taken', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await queryOne<{ id: number; email: string; username: string; isAdmin: boolean; createdAt: Date }>(
      `INSERT INTO users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username, is_admin as "isAdmin", created_at as "createdAt"`,
      [email, username, passwordHash]
    );

    if (!user) {
      throw createError('Failed to create user', 500);
    }

    // Initialize user preferences
    await execute(
      'INSERT INTO user_preferences (user_id) VALUES ($1)',
      [user.id]
    );

    // Initialize user stats
    await execute(
      'INSERT INTO user_stats (user_id) VALUES ($1)',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email and password are required', 400);
    }

    const user = await queryOne<{
      id: number;
      email: string;
      username: string;
      passwordHash: string;
      isAdmin: boolean;
      createdAt: Date;
    }>(
      `SELECT id, email, username, password_hash as "passwordHash",
              is_admin as "isAdmin", created_at as "createdAt"
       FROM users WHERE email = $1`,
      [email]
    );

    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw createError('Invalid email or password', 401);
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const user = await queryOne<{
      id: number;
      email: string;
      username: string;
      isAdmin: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>(
      `SELECT id, email, username, is_admin as "isAdmin",
              created_at as "createdAt", updated_at as "updatedAt"
       FROM users WHERE id = $1`,
      [req.user!.id]
    );

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});
