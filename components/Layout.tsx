import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '~/utils/cn'
import { Navbar, Reel } from '~/components'
import Head from 'next/head'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Kelvon Agee',
  description: 'Producer, Director, and DP telling stories that matter.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const year = new Date().getFullYear()

  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title as string}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <meta name="description" content={metadata.description as string} />
        <meta property="og:site_name" content={metadata.title as string} />
        <meta
          property="og:description"
          content={metadata.description as string}
        />
        <meta property="og:title" content={metadata.title as string} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title as string} />
        <meta
          name="twitter:description"
          content={metadata.description as string}
        />
      </Head>
      <div className={cn('font-sans antialiased', fontSans.variable)}>
        <div className="flex min-h-screen flex-col pt-[65px]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Reel />
          <footer className="flex w-full items-center justify-between gap-y-4 p-2 pt-10 text-center text-xs text-black/30 md:p-4 md:pt-20">
            <div className="flex flex-col items-start gap-y-1">
              <div>&copy; Copyright 2012-{year}. Kelvon Agee.</div>
              {/* <div>
                dev/design by{' '}
                <a href="https://hael.cc">michael ciccarelli</a>
              </div> */}
            </div>
            <div className="flex gap-x-2">
              <div
                className="flex cursor-n-resize items-center gap-x-1"
                onClick={() => handleScroll()}
              >
                <span>Top</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 -translate-y-1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.99 7.5 3.75-3.75m0 0 3.75 3.75m-3.75-3.75v16.499H4.49"
                  />
                </svg>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
