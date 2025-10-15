import type { Request, Response } from 'express';
import  prisma  from "@repo/db";
import { getUserByIdSchema, searchUsersSchema, type GetUserById,type SearchUserInputs} from "@repo/common/types"

export const getUserById= async(req: Request, res: Response): Promise<void>=>{
    try{
        const {id} = getUserByIdSchema.parse({id: req.params.id});
        const user = await prisma.user.findUnique({
            where:{id},
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                createdAt: true, 
                reviewRecieved: {
                    select:{
                        rating: true,
                        comment: true,
                        createdAt: true
                    },
                    from:{
                        select: {
                            id:true,
                            name: true,
                        }
                    }
                },
                orderBy:{
                    createAt: 'desc'
                },
                take:10
            }
        })

        if(!user){
            res.status(404).json({
                success: false,
                msg: 'User not found!'
            })
            return
        }

        //calculate average rating:
        const avgRating = user.reviewsReceived.length > 0
        ? user.reviewsReceived.reduce((acc: any, review: { rating: any; }) => acc + review.rating, 0) / user.reviewsReceived.length
        : 0;

        res.status(200).json({
            success: true,
            data:{
                ...user,
                averageRating: Math.round(avgRating * 10) / 10,
                totalReviews: user.reviewsReceived.length,
            }
        })
    }
    catch(err: any){
        //zod error
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
}