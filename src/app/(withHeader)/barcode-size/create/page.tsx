import { BarcodeSizeProvider } from '../context';
import NewBarcodeSizeContainer from './containers';

export default function NewBarcodeSizePage() {
  return (
    <BarcodeSizeProvider>
      <NewBarcodeSizeContainer />
    </BarcodeSizeProvider>
  );
}
