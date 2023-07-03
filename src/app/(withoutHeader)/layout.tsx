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
      <body className="bg-paperLight dark:bg-darkGreen text-black dark:text-white mx-8 h-full overflow-y-scroll max-lg:mx-4">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
