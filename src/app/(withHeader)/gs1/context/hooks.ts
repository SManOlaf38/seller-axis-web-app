import { useContext } from 'react';
import Gs1Context from './context';

export const useStoreGs1 = () => {
  const { state, dispatch } = useContext(Gs1Context);

  return { state, dispatch };
};
