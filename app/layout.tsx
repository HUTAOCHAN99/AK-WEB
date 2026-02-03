// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Al Khawarizmi',
  description: 'KKMI Al-Khawarizmi - Perkumpulan Mahasiswa Islam dari Jurusan Informatika UPN Yogyakarta',
  icons: {
    icon: '/assets/alkhawarizmi.webp',       
    shortcut: '/assets/alkhawarizmi.webp',
    apple: '/assets/alkhawarizmi.webp',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {children}
      </body>
    </html>
  )
}
