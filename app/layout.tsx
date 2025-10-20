import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import LanguageProvider from '@/components/i18n/LanguageProvider'
import AuthProvider from '@/components/auth/AuthProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies()
  const initialLang = ((store.get('lang')?.value ?? 'en') as 'en' | 'id')

  return (
    <html lang={initialLang}>
      <body>
        <LanguageProvider initialLang={initialLang}>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
