import { useContext } from 'react';
import ProductContext from './context';

export const useStore = () => {
  const { state, dispatch } = useContext(ProductContext);

  return { state, dispatch };
};
