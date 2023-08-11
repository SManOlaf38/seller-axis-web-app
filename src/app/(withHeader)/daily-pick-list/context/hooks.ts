import { useContext } from 'react';
import DailyPickListContext from './context';

export const useStoreDailyPickList = () => {
  const { state, dispatch } = useContext(DailyPickListContext);

  return { state, dispatch };
};
