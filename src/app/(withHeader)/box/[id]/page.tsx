import { BoxProvider } from '../context';
import NewBoxContainer from '../create/containers';

export default function NewPackageRulePage() {
  return (
    <BoxProvider>
      <NewBoxContainer />
    </BoxProvider>
  );
}
