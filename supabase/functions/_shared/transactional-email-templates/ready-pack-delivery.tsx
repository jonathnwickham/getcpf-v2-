import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GetCPF"

interface ReadyPackDeliveryProps {
  name?: string
}

const ReadyPackDeliveryEmail = ({ name }: ReadyPackDeliveryProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Ready Pack is ready — everything you need for the Receita Federal</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={emoji}>📋</Text>
        <Heading style={h1}>
          {name ? `${name}, your Ready Pack is ready!` : 'Your Ready Pack is ready!'}
        </Heading>
        <Text style={text}>
          We've generated your pre-filled government forms and step-by-step office guide. Everything is ready for you to download and print.
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightTitle}>Your Ready Pack includes:</Text>
          <Text style={highlightText}>✓ Pre-filled Receita Federal protocol form</Text>
          <Text style={highlightText}>✓ Step-by-step office guide (in English)</Text>
          <Text style={highlightText}>✓ Document checklist — what to bring</Text>
          <Text style={highlightText}>✓ Office address & directions for your city</Text>
        </Section>

        <Button style={button} href="https://getcpf.com/ready-pack">
          Download your Ready Pack →
        </Button>

        <Hr style={hr} />

        <Section style={tipBox}>
          <Text style={tipTitle}>💡 Pro tip</Text>
          <Text style={tipText}>
            Print everything before you go. Bring your passport, a copy of your passport photo page, and your Ready Pack documents. Most offices handle CPF applications same-day.
          </Text>
        </Section>

        <Text style={text}>
          Questions? Reply to this email or message us on WhatsApp — we're here until you have your CPF number in hand.
        </Text>

        <Text style={footer}>
          — Jonathan, Founder of {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ReadyPackDeliveryEmail,
  subject: 'Your Ready Pack is ready — download & print',
  displayName: 'Ready Pack delivery',
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
const tipBox = { backgroundColor: '#fffbeb', borderRadius: '12px', padding: '16px', margin: '0 0 20px' }
const tipTitle = { fontSize: '14px', fontWeight: '700', color: '#92400e', margin: '0 0 6px' }
const tipText = { fontSize: '13px', color: '#92400e', lineHeight: '1.5', margin: '0' }
const footer = { fontSize: '13px', color: '#999', margin: '0' }
