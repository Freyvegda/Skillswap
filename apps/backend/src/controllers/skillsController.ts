import type { Request, Response } from 'express';
import { getSkills, rebuildSkillsCache } from './redisController.js';

//
//Get popular skills (cached in Redis)
//GET /api/skills/popular
// 
export const getPopularSkillsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const skills = await getSkills();

    res.status(200).json({
      success: true,
      data: skills,
      cached: true,
    });
  } catch (error) {
    console.error('Get popular skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


//Rebuild skills cache (admin only)
// POST /api/skills/rebuild-cache
export const rebuildSkillsCacheController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await rebuildSkillsCache();

    res.status(200).json({
      success: true,
      message: 'Skills cache rebuilt successfully',
    });
  } catch (error) {
    console.error('Rebuild skills cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

