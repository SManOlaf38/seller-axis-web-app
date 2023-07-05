import { Metadata } from 'next';

import NavProfile from './constants/components/NavProfile';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <NavProfile />
      <main className="col-span-4">{children}</main>
    </div>
  );
}
