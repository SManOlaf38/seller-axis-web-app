import { SFTPProvider } from '../context';
import NewSFTPContainer from './containers';

export default function NewSFTPPage() {
  return (
    <SFTPProvider>
      <NewSFTPContainer />
    </SFTPProvider>
  );
}
