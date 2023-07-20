import { BarcodeSizeProvider } from '../context';
import NewBarcodeSizeContainer from '../create/containers';

export default function NewBarcodeSizePage() {
  return (
    <BarcodeSizeProvider>
      <NewBarcodeSizeContainer />
    </BarcodeSizeProvider>
  );
}
