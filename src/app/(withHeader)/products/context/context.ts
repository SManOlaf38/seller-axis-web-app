'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextType } from './type';

const ProductContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null,
});

export default ProductContext;
