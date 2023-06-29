import { Metadata } from 'next';

import NavOrganization from './settings/components/NavOrganization';

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
    <div className='grid grid-cols-5 gap-4'>
      <NavOrganization />
      <main className="col-span-4">
        {children}
      </main>
    </div>

  );
}
