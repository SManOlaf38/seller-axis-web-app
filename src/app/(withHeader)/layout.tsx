import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import httpFetch from '@/utils/fetchRestAPI';
import { Theme } from '@/utils/theme';
import { Header } from '@/components/common/Header';
import { OrganizationProvider } from './organizations/context';
import { ProfileProvider } from './profile/context';
import { ProductProvider } from './products/context';
import { AlertProvider } from '@/components/ui/Alert/context';
import AlertContainer from '@/components/ui/Alert/containers';

import './globals.css';
import { RetailerProvider } from './retailers/context';

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
    return await httpFetchClient.get('organizations?ordering=-created_at&limit=100&offset=0');
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
        <AlertProvider>
          <OrganizationProvider>
            <RetailerProvider>
              <ProductProvider>
                <ProfileProvider>
                  <AlertContainer />
                  <Header currentTheme={currentTheme} />
                  <main className="h-full">{children}</main>
                </ProfileProvider>
              </ProductProvider>
            </RetailerProvider>
          </OrganizationProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
