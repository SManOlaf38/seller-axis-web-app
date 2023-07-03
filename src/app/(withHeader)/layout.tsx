import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Theme } from '@/utils/theme';
import { Header } from '@/components/common/Header';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Next.js Boilerplate'
  },
  description: 'A boilerplate template to explore new Next.js features'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme');
  const currentTheme = theme?.value === 'dark' ? Theme.dark : Theme.light;

  return (
    <html lang="en" className={theme?.value}>
      <body className="mx-8 h-full overflow-y-scroll bg-paperLight bg-[url('/grid.svg')] text-lightPrimary dark:bg-darkGreen dark:text-paperLight max-lg:mx-4">
        <Header currentTheme={currentTheme} />
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
