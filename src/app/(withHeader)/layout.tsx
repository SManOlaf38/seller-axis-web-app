import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import httpFetch from '@/utils/fetchRestAPI';
import { Theme } from '@/utils/theme';
import { Header } from '@/components/common/Header';
import { OrganizationProvider } from './organizations/context';
import { ProfileProvider } from './profile/context';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

const getOrganization = async () => {
  try {
    const httpFetchClient = new httpFetch();
    return await httpFetchClient.get('organizations?limit=100&offset=1');
  } catch (error) {
    console.log('error', error);
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme');
  const currentTheme = theme?.value === 'dark' ? Theme.dark : Theme.light;
  const data = await getOrganization();

  if (data?.results?.length === 0) {
    redirect('/organization/create');
  }

  return (
    <html lang="en" className={theme?.value}>
      <body className="mx-4 bg-paperLight bg-[url('/grid-light.svg')] stroke-santaGrey text-lightPrimary dark:bg-darkGreen dark:bg-[url('/grid.svg')] dark:stroke-santaGrey dark:text-paperLight">
        <OrganizationProvider>
          <ProfileProvider>
            <Header currentTheme={currentTheme} />
            <main className="h-full">{children}</main>
          </ProfileProvider>
        </OrganizationProvider>
      </body>
    </html>
  );
}
