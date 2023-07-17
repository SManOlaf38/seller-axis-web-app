import AccountContainer from './container';
import { AccountProvider } from './context';

export default async function AccountPage() {
  return (
    <AccountProvider>
      <AccountContainer />
    </AccountProvider>
  );
}
