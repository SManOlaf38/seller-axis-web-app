import { PackageRuleProvider } from './context';

export default async function Home() {
  return (
    <PackageRuleProvider>
      <div>Package rule</div>
    </PackageRuleProvider>
  );
}
