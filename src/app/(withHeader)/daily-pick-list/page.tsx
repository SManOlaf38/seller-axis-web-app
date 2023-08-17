import DailyPickListContainer from './container';
import { DailyPickListProvider } from './context';

export default async function Home() {
  return (
    <DailyPickListProvider>
      <DailyPickListContainer />
    </DailyPickListProvider>
  );
}
