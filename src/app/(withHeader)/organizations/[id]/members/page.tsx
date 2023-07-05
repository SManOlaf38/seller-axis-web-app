import { OrganizationProvider } from '../../context';
import MemberOrganizationContainer from './containers';

export default function OrganizationPage({ params }: { params: { id: string } }) {
  return (
    <OrganizationProvider>
      <MemberOrganizationContainer id={params.id} />
    </OrganizationProvider>
  );
}
