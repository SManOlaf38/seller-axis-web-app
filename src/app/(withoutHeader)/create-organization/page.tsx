import { OrganizationProvider } from '../../(withHeader)/organizations/context';
import CreateOrganization from './containers';

export default function Home() {
  return (
    <OrganizationProvider>
      <div className="h-full">
        <CreateOrganization />
      </div>
    </OrganizationProvider>
  );
}
