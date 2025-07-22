import './globals.css';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import DynamicFooter from '@/components/DynamicFooter';

export const metadata = {
  title: 'TalkToBuddha',
  description: 'Share your thoughts with the enlightened one.',
  openGraph: {
    title: 'TalkToBuddha',
    description: 'Share your thoughts with the enlightened one.',
    images: ['https://www.talktobuddha.life/og-image.png'],
    url: 'https://www.talktobuddha.life/',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-yellow-100 to-yellow-200 text-yellow-900 text-base flex flex-col min-h-screen">
        {/* Watermark */}
        <div
          className="fixed top-24 bottom-24 left-0 right-0 opacity-5 bg-no-repeat bg-center bg-contain pointer-events-none z-0"
          style={{ backgroundImage: `url('/buddha-logo.png')` }}
        />

        {/* Header */}
        <header className="z-10 relative flex justify-between items-center px-6 py-4 bg-yellow-300 text-yellow-900 shadow-lg">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/buddha-logo-horizontal.png" alt="TalkToBuddha Logo" className="h-10 w-auto" />
          </Link>
          <nav className="space-x-6 text-base">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/wall" className="hover:underline">Reflection</Link>
            <Link href="/blessing" className="hover:underline">Meditation</Link>
            <Link href="/archive" className="hover:underline">Archives</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow z-10 relative">{children}</main>

        {/* Footer */}
        <DynamicFooter />

        {/* Toast */}
        <Toaster position="bottom-center" toastOptions={{ duration: 2500 }} />
      </body>
    </html>
  );
}
