import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Img, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GetCPF"
const LOGO_URL = 'https://hcewyrhlcpfozhnishlj.supabase.co/storage/v1/object/public/email-assets/logo.png'

interface WaitlistConfirmationProps {
  plan?: string
}

const WaitlistConfirmationEmail = ({ plan }: WaitlistConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're on the {plan || 'premium'} waitlist</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="GET CPF" width="140" height="auto" style={logo} />
        <Heading style={h1}>You're on the list!</Heading>
        <Text style={text}>
          Thanks for joining the waitlist for our <strong>{plan || 'premium'}</strong> tier.
          We're working hard to get it ready and you'll be the first to know when it launches.
        </Text>
        <Text style={text}>
          In the meantime, our Self-Service plan is available right now if you need your CPF sorted quickly.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Jonathan, Founder of {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WaitlistConfirmationEmail,
  subject: (data: Record<string, any>) => `You're on the ${data.plan || 'premium'} waitlist`,
  displayName: 'Waitlist confirmation',
  previewData: { plan: 'Concierge' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '500px', margin: '0 auto' }
const logo = { margin: '0 0 20px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px', textAlign: 'center' as const }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 20px' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0' }
