import type { Metadata } from 'next'
import { Inconsolata, Saira_Condensed } from 'next/font/google'
import './globals.css'

const mono = Inconsolata({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const display = Saira_Condensed({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const DESCRIPTION =
  'Kelvon Agee is a producer, director, and director of photography based in New York and Los Angeles — a 5x Emmy-nominated cinematographer. Browse selected frames on an infinite canvas and watch the reel.'

export const metadata: Metadata = {
  metadataBase: new URL('https://kelvonagee.com'),
  title: {
    default: 'Kelvon Agee — Producer, Director, DP',
    template: '%s · Kelvon Agee',
  },
  description: DESCRIPTION,
  applicationName: 'Kelvon Agee',
  keywords: [
    'Kelvon Agee',
    'cinematographer',
    'director of photography',
    'DP',
    'producer',
    'director',
    'documentary',
    'Deadliest Catch',
    'Life Below Zero',
    'New York',
    'Los Angeles',
  ],
  authors: [{ name: 'Kelvon Agee' }],
  creator: 'Kelvon Agee',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://kelvonagee.com',
    siteName: 'Kelvon Agee',
    title: 'Kelvon Agee — Producer, Director, DP',
    description: DESCRIPTION,
    images: [{ url: '/hero.jpg', alt: 'Kelvon Agee' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kelvon Agee — Producer, Director, DP',
    description: DESCRIPTION,
    images: ['/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${mono.variable} ${display.variable} font-mono`}>
        {children}
      </body>
    </html>
  )
}
