import express, { Router } from 'express';
import {
  getPopularSkillsController,
  rebuildSkillsCacheController,
} from '../controllers/skillsController.js';
import { authenticate } from '../middleware/auth.js';

const router: Router= express.Router();

// Public route - Get popular skills
router.get('/popular', getPopularSkillsController);

// Protected route - Rebuild cache (admin only - you can add admin middleware)
router.post('/rebuild-cache', authenticate, rebuildSkillsCacheController);

export default router;