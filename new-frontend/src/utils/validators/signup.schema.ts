import { z } from 'zod';
import { messages } from '@/config/messages';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateNewPassword
} from '@/utils/validators/common-rules';

// form zod validation schema
export const signUpSchema = z.object({
  firstname: z.string().min(1, { message: messages.firstNameRequired }),
  lastname: z.string().min(1, {message : messages.lastNameRequired}),
  email: validateEmail,
  password: validateNewPassword,
  confirmpassword: validateConfirmPassword,
  isAgreed : z.boolean()
});


// generate form types from zod validation schema
export type SignUpSchema = z.infer<typeof signUpSchema>;
