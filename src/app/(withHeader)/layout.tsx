import { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'DF - Next.js Boilerplate',
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
      <body className="light bg-primary mx-8 h-full overflow-y-scroll bg-[url('/grid.svg')] max-lg:mx-4">
        <Header />
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
