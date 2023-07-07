'use client';

import { ReactNode, useReducer } from 'react';

import ProductAliasContext from './context';
import ProductAliasReducer, { initialState } from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ProductAliasReducer, initialState);

  return (
    <ProductAliasContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductAliasContext.Provider>
  );
}

export default Provider;
