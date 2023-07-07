import { RetailerProvider } from '../context';
import NewRetailerContainer from './containers';

export default function NewRetailerPage() {
  return (
    <RetailerProvider>
      <NewRetailerContainer />
    </RetailerProvider>
  );
}
