import { useContext } from 'react';
import AuthContext from './context';

export const useStore = () => {
  const { state, dispatch } = useContext(AuthContext);

  return { state, dispatch };
};
