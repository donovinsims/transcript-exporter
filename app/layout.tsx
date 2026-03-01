import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
    title: 'Transcript Exporter',
    description: 'Export transcripts from YouTube, Apple Podcasts, and Spotify as Text or Markdown.',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Transcript Exporter',
    },
    applicationName: 'Transcript Exporter',
};

export const viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${manrope.variable} min-h-screen flex flex-col font-sans antialiased text-foreground bg-background`}>
                {children}
                <Toaster />
                <Analytics />
            </body>
        </html>
    );
}

