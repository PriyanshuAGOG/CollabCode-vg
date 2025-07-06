"use client"

import { IntegrationsPanel } from "@/components/integrations/IntegrationsPanel"
import { AuthProvider } from "@/components/auth/AuthProvider"

export default function IntegrationsPage() {
  return (
    <AuthProvider>
      <IntegrationsPanel />
    </AuthProvider>
  )
}
