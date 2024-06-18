import { string, z } from 'zod';
import { validateConfirmPassword, validateEmail, validateNewPassword } from '@/utils/validators/common-rules';

// form zod validation schema
export const forgetPasswordSchema = z.object({
  email: validateEmail,
});
export const resetPasswordSchema = z.object({
  verificationCode: z.string(),
  password: validateNewPassword,
  confirmpassword: validateConfirmPassword,
});

// generate form types from zod validation schema
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
