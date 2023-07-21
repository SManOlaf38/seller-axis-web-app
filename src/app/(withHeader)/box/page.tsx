import BoxContainer from './container';
import { BoxProvider } from './context';

export default async function Home() {
  return (
    <BoxProvider>
      <BoxContainer />
    </BoxProvider>
  );
}
