import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Theme } from '@/utils/theme';
import { Header } from '@/components/common/Header';
import { OrganizationProvider } from './organizations/context';
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
      <body className="bg-paperLight dark:bg-darkGreen text-black dark:text-white mx-8 h-full overflow-y-scroll bg-[url('/grid.svg')] max-lg:mx-4">
        <OrganizationProvider>
          <Header currentTheme={currentTheme} />
        </OrganizationProvider>
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
