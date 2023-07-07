'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import type { ContextProfileType } from '../interface';

const RetailerContext = createContext<ContextProfileType>({
  state: initialState,
  dispatch: () => null
});

export default RetailerContext;
