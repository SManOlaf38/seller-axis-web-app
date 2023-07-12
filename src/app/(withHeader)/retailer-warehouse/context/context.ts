'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import type { ContextType } from '../interface';

const RetailerWarehouseContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null
});

export default RetailerWarehouseContext;
