import { OrganizationProvider } from '@/app/(withHeader)/organizations/context';
import MemberOrganizationContainer from './containers';

export default function ChangeHistoryPage() {
  return (
    <OrganizationProvider>
      <MemberOrganizationContainer />
    </OrganizationProvider>
  );
}
