import type { Request, Response } from "express";
import prisma from "@repo/db";
import {createSessionSchema,
  updateSessionSchema,
  getSessionByIdSchema,
  updateSessionStatusSchema,
  getSessionsQuerySchema,
  type CreateSessionInput,
  type UpdateSessionInput,
  type GetSessionByIdInput,
  type UpdateSessionStatusInput,
  type GetSessionsQueryInput} from "@repo/common/types"


//creating a session:
export const createSession = async ( req:Request, res: Response ): Promise<void>=>{
    try{
        const userId = req.user?.userId;
        const validatedData: CreateSessionInput = createSessionSchema.parse(req.body)
    
        const receiver = await prisma.user.findUnique({
            where: { id: validatedData.receiverId},
        })
    
        //receiver not found 
        if(!receiver){
            res.status(404).json({
                success: false,
                msg: "Receiver not found"
            })
        }
    
        //session with themselves
        if(userId === validatedData.receiverId){
            res.status(400).json({
                success: false,
                msg: "Cannot create session with yourself!"
            })
        }
    
        const session = await prisma.session.create({
            data:{
                requesterId : userId!,
                receiverId: validatedData.receiverId,
                skill: validatedData.skill,
                date: new Date(validatedData.date),
                duration: validatedData.duration || 60,
                notes: validatedData.notes,
                status: "pending",
            },
            include:{
                receiver:{
                    select:{
                        id: true,
                        name: true,
                        email:true
                    }
                },
                requester:{
                    select:{
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })
    
        res.status(200).json({
            success: true,
            data: session,
            msg: "Session created successfully"
        })
    }
    catch(err: any){
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors,
            });
            return;
        }

        console.error('Create session error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}


//Get all user sessions: Get /api/sessions?status=pending&page=1&limit=10
export const getUserSessions = async (req: Request, res: Response): Promise<void> =>{
    try{
        const userId = req.user?.userId;
        const {status, page, limit} = getSessionsQuerySchema.parse(req.query);
        const skip = (page - 1)*limit;

        const where: any = {
            OR:[
                {receiverId: userId},
                {requesterId: userId}
            ]
        }

        if(status){
            where.status = status;
        }

        const [sessions, total]= await Promise.all([
            prisma.findMany({
                where,
                include:{
                    requester:{
                        select:{
                            id: true,
                            name:true,
                            email: true
                        }
                    },
                    receiver:{
                        select:{
                            id: true,
                            name:true,
                            email: true
                        }
                    },
                    reviews: true
                },
                skip,
                take: limit,
                orderBy:{
                    date: 'desc'
                }
            }),
            prisma.session.count({where})
        ])

        res.status(200).json({
            success: true,
            data: sessions,
            pagination:{
                page, 
                limit,
                total, 
                totalPages: Math.ceil(total/limit)
            }
        })
    }

    catch(err: any){
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors,
            });
            return;
        }

        console.error('Get sessions error:', err);
            res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}


//Get Session by id: GET /api/session/:id
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.userId;
        const {id} = getSessionByIdSchema.parse({id: req.params.id});

        const session =  await prisma.session.findUnique({
            where:{
                id
            },
            requester:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    skillsOffered: true
                }
            },
            receiver:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    skillsOffered: true
                }
            }
        })

        if(session){
            res.status(200).json({
                success: true,
                data: session,
            })
        }
    }
    catch(err: any){
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors,
            });
            return;
        }

        console.error('Get sessions error:', err);
            res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}


export const updateSessionStatus =async (req: Request, res: Response): Promise<void> =>{
    const userId = req.user?.userId;
    const {id} = getSessionByIdSchema.parse({id: req.params.id});
    const status = updateSessionSchema.parse(req.body);
    
    const session = prisma.session.findUnique({
        where:{
            id
        },
    })
    
    if(!session){
        res.status(404).json({
            success: false,
            msg: 'Session not found'
        })
        return 
    }
    
    // Only receiver can confirm, both can cancel
    if(status === 'confirmed' && session.receiverId !== userId){
        res.status(401).json({
            success: false,
            msg: 'Only reciever can confirm the session'
        })
        return
    }
    
    if (session.requesterId !== userId && session.receiverId !== userId) {
      res.status(403).json({
            success: false,
            message: 'Access denied',
      });
      return;
    }
    
    const 

}