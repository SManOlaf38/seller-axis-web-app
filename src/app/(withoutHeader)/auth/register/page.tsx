import { AuthProvider } from '../context';
import RegisterContainer from './containers';

export default function Home() {
  return (
    <AuthProvider>
      <div className="h-full">
        <RegisterContainer />
      </div>
    </AuthProvider>
  );
}
