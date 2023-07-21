import { Metadata } from 'next';
import './globals.css';
import { cookies } from 'next/headers';
import { AlertProvider } from '@/components/ui/Alert/context';
import AlertContainer from '@/components/ui/Alert/containers';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme');

  return (
    <html lang="en" className={`${theme?.value} h-full`}>
      <AlertProvider>
        <body className="mx-4 h-full bg-paperLight bg-[url('/grid.svg')] stroke-santaGrey text-lightPrimary dark:bg-darkGreen dark:stroke-santaGrey dark:text-paperLight">
          <AlertContainer />
          <main className="h-full">{children}</main>
        </body>
      </AlertProvider>
    </html>
  );
}
