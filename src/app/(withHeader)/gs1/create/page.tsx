import { Gs1Provider } from '../context';
import NewGs1Container from './containers';

export default function NewGs1Page() {
  return (
    <Gs1Provider>
      <NewGs1Container />
    </Gs1Provider>
  );
}
