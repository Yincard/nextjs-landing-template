import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { SessionProvider } from '../components/providers/SessionProvider';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Landing Page',
  description: 'Created with Next.js and Firebase'
};

export default function RootLayout({ children }) {
  // Check if the current path is dashboard
  const isDashboard = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {isDashboard ? (
              children
            ) : (
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            )}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}