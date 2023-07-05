export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">{children}</main>
  );
}
