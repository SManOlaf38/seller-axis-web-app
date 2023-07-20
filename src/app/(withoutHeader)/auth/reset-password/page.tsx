import { AuthProvider } from '../context';
import ResetPasswordContainer from './containers';

export default function Home() {
  return (
    <AuthProvider>
      <ResetPasswordContainer />
    </AuthProvider>
  );
}
