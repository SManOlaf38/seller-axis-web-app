import RetailerContainer from './containers';
import { RetailerProvider } from './context';

export default async function Home() {
  return (
    <RetailerProvider>
      <RetailerContainer />
    </RetailerProvider>
  );
}
