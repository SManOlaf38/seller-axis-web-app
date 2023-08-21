'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import type { ContextType } from '../interface';

const Gs1Context = createContext<ContextType>({
  state: initialState,
  dispatch: () => null
});

export default Gs1Context;
