import { useContext } from 'react';
import RetailerContext from './context';

export const useStore = () => {
  const { state, dispatch } = useContext(RetailerContext);

  return { state, dispatch };
};
