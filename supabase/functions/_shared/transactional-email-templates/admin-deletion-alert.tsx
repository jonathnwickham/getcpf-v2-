import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "GetCPF"
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "support@getcpf.com"

interface AdminDeletionAlertProps {
  count?: number
  accountList?: string
}

const AdminDeletionAlertEmail = ({ count, accountList }: AdminDeletionAlertProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{count || 0} account(s) due for deletion</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Account Cleanup Required</Heading>
        <Text style={text}>
          <strong>{count || 0}</strong> account(s) are 90+ days old and have never completed a payment.
          These are flagged for deletion per our data retention policy.
        </Text>

        {accountList && (
          <Section style={codeBlock}>
            <Text style={codeText}>{accountList}</Text>
          </Section>
        )}

        <Text style={text}>
          Review these in the admin dashboard and delete as needed.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Automated alert from {SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminDeletionAlertEmail,
  subject: (data: Record<string, any>) => `${data.count || 0} account(s) due for deletion`,
  to: ADMIN_EMAIL,
  displayName: 'Admin deletion alert',
  previewData: { count: 3, accountList: '- user1@example.com (created 2024-01-01)\n- user2@example.com (created 2024-01-15)' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '500px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 20px' }
const codeBlock = { backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px', margin: '0 0 20px' }
const codeText = { fontSize: '12px', color: '#333', lineHeight: '1.8', margin: '0', whiteSpace: 'pre-wrap' as const, fontFamily: 'monospace' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { fontSize: '13px', color: '#999', margin: '0' }
