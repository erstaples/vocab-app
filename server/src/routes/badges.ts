import { Router, Response } from 'express';
import { query } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Badge } from '@vocab-builder/shared';

export const badgesRouter = Router();

// GET /api/badges - Get all badges
badgesRouter.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const badges = await query<Badge>(
      `SELECT id, name, description, icon_url as "iconUrl", requirement, xp_bonus as "xpBonus"
       FROM badges
       ORDER BY xp_bonus ASC`
    );

    res.json(badges);
  } catch (error) {
    next(error);
  }
});
