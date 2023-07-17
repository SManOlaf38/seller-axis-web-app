import { useContext } from 'react';
import SearchContext from './context';

export const useStoreAccount = () => {
  const { state, dispatch } = useContext(SearchContext);

  return { state, dispatch };
};
