import { Metadata } from 'next';
import { cookies } from 'next/headers';
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
  const theme = cookies().get('theme');

  return (
    <html lang="en" className={`${theme?.value} h-full`}>
      <body className="h-full bg-paperLight bg-[url('/grid.svg')] stroke-santaGrey dark:stroke-santaGrey text-lightPrimary dark:bg-darkGreen dark:text-paperLight mx-4">
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
