import SFTPContainer from './containers';
import { SFTPProvider } from './context';

export default async function Home() {
  return (
    <SFTPProvider>
      <SFTPContainer />
    </SFTPProvider>
  );
}
