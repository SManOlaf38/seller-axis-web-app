import { useContext } from 'react';
import BarcodeSizeContext from './context';

export const useStoreBarcodeSize = () => {
  const { state, dispatch } = useContext(BarcodeSizeContext);

  return { state, dispatch };
};
