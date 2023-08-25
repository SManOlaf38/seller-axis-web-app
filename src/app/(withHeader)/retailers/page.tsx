import { Gs1Provider } from '../gs1/context';
import RetailerContainer from './containers';
import { RetailerProvider } from './context';

export default async function Home() {
  return (
    <RetailerProvider>
      <Gs1Provider>
        <RetailerContainer />
      </Gs1Provider>
    </RetailerProvider>
  );
}
