import './globals.css'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Al Khawarizmi',
  description: 'KKMI Al-Khawarizmi - Perkumpulan Mahasiswa Islam dari Jurusan Informatika UPN Yogyakarta',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="shortcut icon" href="/assets/alkhawarizmi.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
      </body>
    </html>
  )
}
