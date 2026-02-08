import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'VibeCode Next.js',
    description: 'Next.js starter template for VibeCode',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
