import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NextReach — E-ticaret Analitik Dashboard',
  description: 'Orta ölçekli e-ticaret firmaları için analitik dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
