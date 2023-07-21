import BarcodeSizeContainer from './container';
import { BarcodeSizeProvider } from './context';

export default async function Home() {
  return (
    <BarcodeSizeProvider>
      <BarcodeSizeContainer />
    </BarcodeSizeProvider>
  );
}
