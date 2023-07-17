import { useContext } from 'react';
import AlertContext from './context';

export const useStore = () => {
  const { state, dispatch } = useContext(AlertContext);

  return { state, dispatch };
};
