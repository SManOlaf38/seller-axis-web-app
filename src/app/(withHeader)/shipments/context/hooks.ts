import { useContext } from 'react';
import ShipmentsContext from './context';

export const useStoreShipments = () => {
  const { state, dispatch } = useContext(ShipmentsContext);

  return { state, dispatch };
};
