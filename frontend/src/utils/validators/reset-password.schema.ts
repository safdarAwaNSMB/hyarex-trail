import { string, z } from 'zod';
import { messages } from '@/config/messages';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validators/common-rules';

// form zod validation schema
export const resetPasswordSchema = z
  .object({
    verificationCode: z.string(),
    password: validatePassword,
    confirmpassword: validateConfirmPassword,
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: messages.passwordsDidNotMatch,
    path: ['confirmPassword'], // Correct path for the confirmedPassword field
  });

// generate form types from zod validation schema
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
