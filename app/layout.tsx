import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GlassUI Studio - Free CSS Glassmorphism Generator',
  description: 'Generate modern UI glassmorphism styles and copy CSS code instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}