import { PackageRuleProvider } from '../context';
import NewPackageRuleContainer from './containers';

export default function NewPackageRulePage() {
  return (
    <PackageRuleProvider>
      <NewPackageRuleContainer />
    </PackageRuleProvider>
  );
}
