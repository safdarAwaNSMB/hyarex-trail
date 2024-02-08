import { z } from 'zod';
import { messages } from '@/config/messages';


export const otpSchema = z.object({
    otp: z.string().min(1, { message: messages.otpRequired }).min(5, { message: messages.otpLength })
});

// generate form types from zod validation schema
export type OTPSchema = z.infer<typeof otpSchema>;
