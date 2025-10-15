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
    skillsWanted: z.array(z.string()).min(1, "Atleast one skill must be wanted")
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
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
});


//session schemas:
export const createSessionSchema = z.object({
    receiverId: z.string(),
    skill : z.string().min(1, 'Skill is required'),
    date: z.string().datetime('Invalid date format')
})