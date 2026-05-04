import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProvider } from '@/components/providers/AppProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'GanttFlow - Construction Project Management',
  description: 'Professional Gantt chart software for construction project management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=1200, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-w-[1200px] overflow-x-auto`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
