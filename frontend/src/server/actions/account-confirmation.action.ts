'use server';

import { render } from '@react-email/render';
import { sendEmail } from '@/utils/email';
import AccountConfirmationEmail from '@/email-templates/account-confirmation';

export const sendAccountConfirmationEmail = async (data: { email: string, firstName : string, verificationCode : string }) => {
  const to = `<${data.email}>`;
  console.log(data);
  

  await sendEmail({
    to: to,
    subject: 'Your Account is Created!',
    html: render(AccountConfirmationEmail(data)),
  });

  // return true;
};
