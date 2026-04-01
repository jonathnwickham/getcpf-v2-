/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as purchaseConfirmation } from './purchase-confirmation.tsx'
import { template as readyPackDelivery } from './ready-pack-delivery.tsx'
import { template as contactFormConfirmation } from './contact-form-confirmation.tsx'
import { template as waitlistConfirmation } from './waitlist-confirmation.tsx'
import { template as onboardingWelcome } from './onboarding-welcome.tsx'
import { template as adminDeletionAlert } from './admin-deletion-alert.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'purchase-confirmation': purchaseConfirmation,
  'ready-pack-delivery': readyPackDelivery,
  'contact-form-confirmation': contactFormConfirmation,
  'waitlist-confirmation': waitlistConfirmation,
  'onboarding-welcome': onboardingWelcome,
  'admin-deletion-alert': adminDeletionAlert,
}
