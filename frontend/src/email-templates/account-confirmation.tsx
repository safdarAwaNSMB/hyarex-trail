import { Html } from '@react-email/html';
import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Column } from '@react-email/column';
import { Head } from '@react-email/head';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';
import { Row } from '@react-email/row';
import { Text } from '@react-email/text';
import { Heading } from '@react-email/heading';
import { Section } from '@react-email/section';
import { Hr } from '@react-email/hr';

export default function VercelInviteUserEmail(data: { email: string, firstName: string, verificationCode: string }) {

console.log('request made for email');

  return (
    <Html>
      <Head />
      <Preview>Verify Your Account</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ marginTop: '32px' }}>
            <Img
              src="https://isomorphic-furyroad.vercel.app/logo.svg"
              alt="Your Company Logo"
              style={{
                margin: '0 auto',
              }}
            />
          </Section>
          <Heading style={heading}>
            Welcome to <strong>Hyarex , A great market for you</strong>
          </Heading>
          <Text style={subheading}>
            Hello <strong>{data.firstName}</strong>,
          </Text>
          <Text style={subheading}>
            You have just initiated the account verification process.
          </Text>
          <Text style={subheading}>
            Your verification code:
            <br />
            <strong>{data.verificationCode}</strong>
          </Text>
          <Section
            style={{
              textAlign: 'center',
              margin: '32px 0',
            }}
          >
          </Section>
          <Text style={subheading}>
            If you did not initiate this request, please ignore this email.
          </Text>
          <Hr style={{ ...global.hr, marginTop: '26px' }} />
          <Section style={{ paddingTop: '22px' }}>
            {/* <Text style={{ ...footer.text, paddingTop: 10 }}>
              If you have any questions, please contact us at <Link href={`mailto:info@your-company.com`}>info@your-company.com</Link>.
            </Text> */}
            <Text style={footer.text}>
              © {new Date().getFullYear()} Hyarex, Inc. All Rights Reserved.
            </Text>
            <Text style={footer.text}>
              Hyarex, Inc. 123 Main Street, City, Country.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const paddingX = {
  paddingLeft: '40px',
  paddingRight: '40px',
};

const paddingY = {
  paddingTop: '22px',
  paddingBottom: '22px',
};

const paragraph = {
  margin: '0',
  lineHeight: '2',
};

const global = {
  paddingX,
  paddingY,
  defaultPadding: {
    ...paddingX,
    ...paddingY,
  },
  paragraphWithBold: { ...paragraph, fontWeight: 'bold' },
  heading: {
    fontSize: '32px',
    lineHeight: '1.3',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '-1px',
  } as React.CSSProperties,
  text: {
    ...paragraph,
    color: '#747474',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#111',
    fontSize: '14px',
    border: 0,
    borderRadius: 6,
    textDecoration: 'none',
    padding: '14px 24px',
    display: 'inline-block',
    textAlign: 'center',
    fontWeight: 500,
    color: '#fff',
  } as React.CSSProperties,
  hr: {
    borderColor: '#E5E5E5',
    margin: '0',
  },
};
const body = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
const container = {
  borderRadius: '4px',
  border: '1px solid #eaeaea',
  padding: 20,
  width: 465,
  margin: '40px auto',
};
const heading = {
  padding: 0,
  margin: '30px 0',
  fontWeight: 400,
  textAlign: 'center',
  color: '#111',
  fontSize: '24px',
} as React.CSSProperties;
const subheading = {
  color: '#000000',
  fontSize: '14px',
  lineHeight: 1.5,
  margin: '16px 0',
};
const footer = {
  policy: {
    width: '166px',
    margin: 'auto',
  },
  text: {
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center',
  } as React.CSSProperties,
  link: {
    margin: '0',
    color: '#AFAFAF',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'underline',
  } as React.CSSProperties,
};
