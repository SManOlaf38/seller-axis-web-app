import { Metadata } from 'next';
import './globals.css';
import { cookies } from 'next/headers';
export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = cookies().get('theme');

  return (
    <html lang="en" className={`${theme?.value} h-full`}>
      <body className="h-full bg-paperLight bg-[url('/grid.svg')] stroke-santaGrey dark:stroke-santaGrey text-lightPrimary dark:bg-darkGreen dark:text-paperLight mx-4">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
