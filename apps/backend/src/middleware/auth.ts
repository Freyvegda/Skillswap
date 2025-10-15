import type {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken";
import type { JWTPayload } from "@repo/common/types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET 
if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not verified");
}

//generate token function:
export const generateToken = (payload: string | object): string=> {
    return jwt.sign(payload, JWT_SECRET)
}

//verifying the token
export const verifyToken= (token: string): JWTPayload=>{
    try{
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    }
    catch(error){
        throw new Error('Invalid or expired token!')
    }
}

//authentication middleware:
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try{
        const authHeader = req.headers.authorization;
    
        if(!authHeader || !authHeader.startsWith('Bearer')){
            res.status(401).json({
                success: false, 
                msg: "No token provided, Please login"
            })
            return
        }
    
        const token  = authHeader?.substring(7);
    
        const decoded = verifyToken(token)
    
        req.user = decoded;
        next()
    }
    catch(err){
        res.status(401).json({
            success: false,
            msg: "Invalid token"
        })
    }
}

