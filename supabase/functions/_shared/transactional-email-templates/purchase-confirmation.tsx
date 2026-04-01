import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GetCPF"

interface PurchaseConfirmationProps {
  name?: string
}

const PurchaseConfirmationEmail = ({ name }: PurchaseConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're in — let's get your CPF sorted</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={emoji}>🇧🇷</Text>
        <Heading style={h1}>
          {name ? `Welcome, ${name}!` : 'Welcome to GetCPF!'}
        </Heading>
        <Text style={text}>
          Your payment has been confirmed. You now have full access to the CPF application service.
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightTitle}>What happens next?</Text>
          <Text style={highlightText}>1. Fill in your details (takes ~5 minutes)</Text>
          <Text style={highlightText}>2. We generate your pre-filled government forms</Text>
          <Text style={highlightText}>3. Walk into the Receita Federal and walk out with your CPF</Text>
        </Section>

        <Button style={button} href="https://getcpf.com/get-started">
          Start your application →
        </Button>

        <Hr style={hr} />

        <Text style={text}>
          If you have any questions, just reply to this email or reach out on WhatsApp — we're here to help.
        </Text>

        <Text style={footer}>
          — Jonathan, Founder of {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PurchaseConfirmationEmail,
  subject: "You're in — let's get your CPF sorted",
  displayName: 'Purchase confirmation',
  previewData: { name: 'Alex' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '500px', margin: '0 auto' }
const emoji = { fontSize: '36px', margin: '0 0 10px', textAlign: 'center' as const }
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
