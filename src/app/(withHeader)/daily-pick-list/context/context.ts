'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextType } from '../interfaces';

const DailyPickListContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => null
});

export default DailyPickListContext;
