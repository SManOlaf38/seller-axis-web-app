import HeaderPage from './components/HeaderPage';
import NavLeft from './components/NavLeft';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderPage />
      <div className="grid grid-cols-7 gap-4">
        <NavLeft />
        <main className="col-span-6">{children}</main>
      </div>
    </>
  );
}
