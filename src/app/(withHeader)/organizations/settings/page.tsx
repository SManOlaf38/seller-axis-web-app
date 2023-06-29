import { OrganizationProvider } from "../context";
import { getOrganizationDetailServer } from "../fetch/dataFetch";
import OrganizationContainer from "./container";

export default async function WareHousePage({ params }: { params: { id: string } }) {

  const data = await getOrganizationDetailServer(params.id);

  return (
    <OrganizationProvider>
      <OrganizationContainer detail={data} />
    </OrganizationProvider>
  );
}
