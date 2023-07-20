import { useContext } from 'react';
import ProductSeriesContext from './context';

export const useStore = () => {
  const { state, dispatch } = useContext(ProductSeriesContext);

  return { state, dispatch };
};
