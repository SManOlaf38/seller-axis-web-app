import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Next.js Boilerplate',
  },
  description: 'A boilerplate template to explore new Next.js features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full [color-scheme:dark]">
      <body className="light bg-primary h-full overflow-y-scroll">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
