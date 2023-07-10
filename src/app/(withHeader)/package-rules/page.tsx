import PackageRuleContainer from './containers';
import { PackageRuleProvider } from './context';

export default async function Home() {
  return (
    <PackageRuleProvider>
      <PackageRuleContainer />
    </PackageRuleProvider>
  );
}
