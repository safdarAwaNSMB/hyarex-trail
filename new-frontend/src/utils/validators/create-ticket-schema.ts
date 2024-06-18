import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const createTicketSchema = z.object({
    name: z.string().min(1, { message: messages.snippetNameIsRequired }),
    ticketType: z.string().min(1, { message: 'This is required!' }),
    content: z.string().min(1, { message: 'This is required!' }),
});

// generate form types from zod validation schema
export type CreateTicketInput = z.infer<typeof createTicketSchema>;
