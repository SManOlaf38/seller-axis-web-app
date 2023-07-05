import OrganizationContainer from './container';

export default async function WareHousePage({ params }: { params: { id: string } }) {
  return <OrganizationContainer id={params.id} />;
}
