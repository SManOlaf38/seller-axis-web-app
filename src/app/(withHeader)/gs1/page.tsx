import Gs1Container from './container';
import { Gs1Provider } from './context';

export default async function Home() {
  return (
    <Gs1Provider>
      <Gs1Container />
    </Gs1Provider>
  );
}
