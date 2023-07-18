import { useContext } from 'react';
import BoxContext from './context';

export const useStoreBox = () => {
  const { state, dispatch } = useContext(BoxContext);

  return { state, dispatch };
};
