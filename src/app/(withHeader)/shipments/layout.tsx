import NavLeft from './components/NavLeft';
import { ShipmentsProvider } from './context';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShipmentsProvider>
      <div className="grid grid-cols-7 gap-4">
        <NavLeft />
        <main className="col-span-6">{children}</main>
      </div>
    </ShipmentsProvider>
  );
}
