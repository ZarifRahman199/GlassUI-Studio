import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GlassUI Studio — Premium CSS Toolkit for Modern Developers',
  description: 'Professional CSS toolkit with 35+ generators for glassmorphism, gradients, shadows, animations, layouts, and more. Generate production-ready CSS instantly.',
  keywords: 'CSS toolkit, glassmorphism, CSS generator, web development, CSS tools, gradient generator, animation creator',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
