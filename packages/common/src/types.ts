import z from "zod";

//auth schemas
export const registerSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string()
            .min(6, 'Password must be of 6 characters!')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Lenght of name should be more than 2 characters').max(100),
    skillsOffered: z.array(z.string()).min(1, "Please specify atleast one skill "),
    skillsWanted: z.array(z.string()).min(1, "Atleast one skill must be wanted"),
    location: z.string().min(2).max(100)
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
})


//user schemas
export const getUserByIdSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export const searchUsersSchema = z.object({
  skill: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default("10"),
});


//session schemas:
export const createSessionSchema = z.object({
    receiverId: z.string(),
    skill : z.string().min(1, 'Skill is required'),
    date: z.string().datetime('Invalid date format'),
    duration: z.number().int().min(15).max(240).optional().default(60),
    notes: z.string().max(1000).optional()
})

export const updateSessionSchema = z.object({
    date: z.string().datetime('Invalid date format').optional(),
    duration: z.number().int().min(15).max(240).optional(),
    status : z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    notes: z.string().max(1000).optional()
})

export const getSessionByIdSchema = z.object({
  id: z.string().uuid('Invalid session ID'),
});

export const updateSessionStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

export const getSessionsQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
});


//types:
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export type GetUserById= z.infer<typeof getUserByIdSchema>
export type SearchUserInputs = z.infer<typeof searchUsersSchema>

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type GetSessionByIdInput = z.infer<typeof getSessionByIdSchema>;
export type UpdateSessionStatusInput = z.infer<typeof updateSessionStatusSchema>;
export type GetSessionsQueryInput = z.infer<typeof getSessionsQuerySchema>;

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
}

export interface ApiResponse<T= any>{
  success: boolean;
  msg: string;
  data?: T;
  err?: string;
}

export interface Pagination<T>{
  success: boolean;
  data :T[];
  pagination:{
    page: number;
    limit: number;
    total: number;
    totalPages: number
  }
}