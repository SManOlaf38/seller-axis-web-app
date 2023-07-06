import { useContext } from 'react';
import SearchContext from './context';

export const useStoreProfile = () => {
  const { state, dispatch } = useContext(SearchContext);

  return { state, dispatch };
};
