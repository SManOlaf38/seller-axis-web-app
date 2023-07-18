'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import type { ContextType } from '../interface';

const BoxContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null
});

export default BoxContext;
