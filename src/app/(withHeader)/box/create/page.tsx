import { BoxProvider } from '../context';
import NewBoxContainer from './containers';

export default function NewBoxPage() {
  return (
    <BoxProvider>
      <NewBoxContainer />
    </BoxProvider>
  );
}
