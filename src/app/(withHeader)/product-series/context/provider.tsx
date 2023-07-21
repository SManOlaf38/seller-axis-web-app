'use client';

import { ReactNode, useReducer } from 'react';

import ProductSeriesContext from './context';
import ProductSeriesReducer, { initialState } from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ProductSeriesReducer, initialState);

  return (
    <ProductSeriesContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductSeriesContext.Provider>
  );
}

export default Provider;
