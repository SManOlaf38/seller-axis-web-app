import { RetailerProvider } from '../context';
import NewRetailerContainer from '../create/containers';

export default function NewRetailerPage() {
  return (
    <RetailerProvider>
      <NewRetailerContainer  />
    </RetailerProvider>
  );
}
