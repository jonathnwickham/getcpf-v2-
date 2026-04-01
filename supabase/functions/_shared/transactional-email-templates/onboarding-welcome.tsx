import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GetCPF"
const LOGO_URL = 'https://hcewyrhlcpfozhnishlj.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface OnboardingWelcomeProps {
  name?: string
}

const OnboardingWelcomeEmail = ({ name }: OnboardingWelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Ready Pack is waiting - here's what to do first</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="GET CPF" width="140" height="auto" style={logo} />
        <Heading style={h1}>
          {name ? `Hey ${name}, your Ready Pack is waiting` : 'Your Ready Pack is waiting'}
        </Heading>
        <Text style={text}>
          Welcome aboard! You've made the smart move. Here's what to do to get your CPF as quickly as possible:
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightTitle}>Quick checklist:</Text>
          <Text style={highlightText}>1. Log in and fill out your details (~5 mins)</Text>
          <Text style={highlightText}>2. Upload your passport photo and selfie</Text>
          <Text style={highlightText}>3. Double-check your mother's name matches your passport exactly</Text>
          <Text style={highlightText}>4. Review your pre-filled forms and email template</Text>
        </Section>

        <Text style={text}>
          The most common issue? Getting your mother's name wrong. Check your passport carefully - it needs to match exactly.
        </Text>

        <Button style={button} href="https://getcpf.com/get-started">
          Open your Ready Pack →
        </Button>

        <Hr style={hr} />

        <Text style={text}>
          Questions? Just reply to this email. I personally read every one.
        </Text>

        <Text style={footer}>
          Jonathan, Founder of {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OnboardingWelcomeEmail,
  subject: "Your Ready Pack is waiting - here's what to do first",
  displayName: 'Onboarding welcome',
  previewData: { name: 'Alex' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '500px', margin: '0 auto' }
const logo = { margin: '0 0 20px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' as const }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 20px' }
const highlightBox = { backgroundColor: '#f0faf5', borderRadius: '12px', padding: '20px', margin: '0 0 24px' }
const highlightTitle = { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 10px' }
const highlightText = { fontSize: '14px', color: '#555', lineHeight: '1.5', margin: '0 0 6px' }
const button = {
  backgroundColor: 'hsl(160, 84%, 28%)',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '14px 28px',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  margin: '0 0 24px',
}
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0' }
