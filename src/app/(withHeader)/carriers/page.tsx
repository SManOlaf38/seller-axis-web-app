import RetailerCarrierContainer from './containers';
import { RetailerCarrierProvider } from './context';

export default async function Home() {
  return (
    <RetailerCarrierProvider>
      <RetailerCarrierContainer />
    </RetailerCarrierProvider>
  );
}
