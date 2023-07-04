import { OrganizationProvider } from '../context';
import MemberOrganizationContainer from './containers';

export default function OrganizationPage() {
  return (
    <OrganizationProvider>
      <MemberOrganizationContainer />
    </OrganizationProvider>
  );
}
