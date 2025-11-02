import type { Request, Response } from 'express';
import prisma from '@repo/db';
import { getUserByIdSchema, searchUsersSchema } from "@repo/common/types"
import { updateSkillsCount } from '../controllers/redisController.js';

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = getUserByIdSchema.parse({ id: req.params.id });
    
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        skillsOffered: true,
        skillsWanted: true,
        createdAt: true,
        reviewsReceived: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
            from: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        msg: 'User not found!',
      });
      return;
    }

    // Calculate average rating
    const avgRating =
      user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((acc: any, review: { rating: any; }) => acc + review.rating, 0) /
          user.reviewsReceived.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        ...user,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: user.reviewsReceived.length,
      },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
      return;
    }

    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const searchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill, page, limit } = searchUsersSchema.parse(req.query);
    const skip = (page - 1) * limit;

    const where = skill
      ? {
          skillsOffered: {
            has: skill,
          },
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          location: true,
          skillsOffered: true,
          skillsWanted: true,
          reviewsReceived: {
            select: {
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const userWithRating = users.map((user: { [x: string]: any; reviewsReceived: any; }) => {
      const avgRating =
        user.reviewsReceived.length > 0
          ? user.reviewsReceived.reduce((acc: any, review: { rating: any; }) => acc + review.rating, 0) /
            user.reviewsReceived.length
          : 0;

      const { reviewsReceived, ...userWithoutRating } = user;

      return {
        ...userWithoutRating,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: reviewsReceived.length,
      };
    });

    res.status(200).json({
      success: true,
      data: userWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
      return;
    }

    console.error('Search users error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        skillsOffered: true,
        skillsWanted: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      msg: 'Users Found',
      data: users,
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update user profile and update skill counts in Redis
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { skillsOffered: true },
    });

    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const { skillsOffered, ...otherData } = req.body;

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...otherData,
        ...(skillsOffered && { skillsOffered }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        skillsOffered: true,
        skillsWanted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Update Redis skill counts if skills changed
    if (skillsOffered) {
      // Remove old skills
      await updateSkillsCount(currentUser.skillsOffered, 'remove');
      // Add new skills
      await updateSkillsCount(skillsOffered, 'add');
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
