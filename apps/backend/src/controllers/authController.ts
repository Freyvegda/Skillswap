import type { Request, Response } from "express";
import bcrypt from  "bcrypt"
import prisma from "@repo/db"
import { generateToken } from "../middleware/auth.js";
import { registerSchema, loginSchema, type RegisterInput, type LoginInput,  } from "@repo/common/types";


export const register = async (req: Request, res: Response): Promise<void> =>{
    try{
        const validatedData: RegisterInput = registerSchema.parse(req.body);
    
        const existingUser = await prisma.user.findUnique({
            where: {email: validatedData.email}
        })
    
        if(existingUser){
            res.status(400).json({
                success: false,
                msg: "User already exist! Try other email"
            })
            return
        }

        const hasedPassword = await bcrypt.hash(validatedData.password, 10);

        const user = await prisma.user.create({
            data:{
                email: validatedData.email,
                password: hasedPassword,
                name: validatedData.name,
                skillsOffered: validatedData.skillsOffered,
                skillsWanted : validatedData.skillsWanted,
                location: validatedData.location,
            },
            select:{
                id: true, 
                email: true,
                name: true,
                skillsOffered: true,
                skillsWanted: true,
                createdAt: true,
                location: true
            }
        })

        const token = generateToken({
            userId: user.id,
            email: user.email
        })

        res.status(201).json({
            success: true,
            msg: 'User register', 
            data:{
                user, token
            }
        })
    }
    catch(err:any){
        if (err.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: err.errors,
            });
            return;
        }

        console.error('Register error:', err);
            res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    } 
} 




//login route:
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData: LoginInput = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email: validatedData.email
            }
        });

        if (!user) {
            res.status(401).json({
                success: false,
                msg: 'Invalid credentials'
            });
            return;
        }

        //validating password
        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            user.password
        );
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                msg: 'Invalid password'
            });
            return;
        }

        const token = generateToken({
            userId: user.id,
            email: user.email
        });

        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token,
            },
        });
    }
    catch (error: any) {
        if (error.name === 'ZodError') {
            res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}