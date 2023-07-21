import { AuthProvider } from '../context';
import ForgotPasswordContainer from './containers';

export default function Home() {
  return (
    <AuthProvider>
      <ForgotPasswordContainer />
    </AuthProvider>
  );
}
