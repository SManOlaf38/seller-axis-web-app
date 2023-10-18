import { Metadata } from 'next';
import NavOrganization from './[id]/settings/components/NavOrganization';
import { OrderProvider } from '../orders/context';

export const metadata: Metadata = {
  title: {
    default: 'Seller Axis',
    template: '% | Seller Axis'
  },
  description: 'Seller Axis'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <OrderProvider>
      <div className="grid grid-cols-5 gap-4">
        <NavOrganization />
        <main className="col-span-4">{children}</main>
      </div>
    </OrderProvider>
  );
}
