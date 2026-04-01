import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GET CPF"
const LOGO_URL = 'https://hcewyrhlcpfozhnishlj.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface ContactConfirmationProps {
  name?: string
}

const ContactFormConfirmationEmail = ({ name }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="GET CPF" width="140" height="auto" style={logo} />
        <Heading style={h1}>
          {name ? `Thanks, ${name}!` : 'Thanks for reaching out!'}
        </Heading>
        <Text style={text}>
          We received your message and will get back to you within 24 hours.
        </Text>
        <Text style={text}>
          In the meantime, check out our guides for answers to common CPF questions.
        </Text>
        <Text style={footer}>Best regards, The {SITE_NAME} Team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormConfirmationEmail,
  subject: 'We received your message',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '40px 25px' }
const logo = { marginBottom: '24px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a1a2e', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
