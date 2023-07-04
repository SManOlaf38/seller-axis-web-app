import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Theme } from '@/utils/theme';
import { Header } from '@/components/common/Header';
import { OrganizationProvider } from './organizations/context';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme');
  const currentTheme = theme?.value === 'dark' ? Theme.dark : Theme.light;

  return (
    <html lang="en" className={theme?.value}>
      <body className="bg-paperLight bg-[url('/grid.svg')] stroke-santaGrey dark:stroke-santaGrey text-lightPrimary dark:bg-darkGreen dark:text-paperLight mx-4">
        <OrganizationProvider>
          <Header currentTheme={currentTheme} />
        </OrganizationProvider>
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
