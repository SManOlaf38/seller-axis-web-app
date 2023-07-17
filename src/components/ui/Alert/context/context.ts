'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextType } from './type';

const RetailerContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null
});

export default RetailerContext;
