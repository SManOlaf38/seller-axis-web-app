'use client';

import { useReducer, ReactNode } from 'react';
import ProductReducer, { initialState } from './reducer';
import ProductContext from './context';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ProductReducer, initialState);

  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>;
}

export default Provider;
