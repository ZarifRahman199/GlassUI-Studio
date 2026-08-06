import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GlassUI Studio — Build Stunning UIs With Pure CSS',
  description: 'The ultimate CSS toolkit with 35+ professional generators. Create glassmorphism, gradients, shadows, animations, and more. Preview live, copy production-ready code in seconds.',
  keywords: 'CSS toolkit, glassmorphism, CSS generator, web development, CSS tools, gradient generator, animation creator, CSS studio',
  openGraph: {
    title: 'GlassUI Studio — Build Stunning UIs With Pure CSS',
    description: '35+ professional CSS tools for modern developers. Preview live, copy code instantly.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
