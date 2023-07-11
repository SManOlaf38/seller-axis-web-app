import { PackageRuleProvider } from '../context';
import NewPackageRule from '../create/containers';

export default function NewPackageRulePage() {
  return (
    <PackageRuleProvider>
      <NewPackageRule />
    </PackageRuleProvider>
  );
}
