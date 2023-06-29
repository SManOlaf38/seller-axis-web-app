'use client'

import { createContext } from 'react';

import { initialState } from './reducer';
import { IContextWarehouse } from './type';

const OrganizationContext = createContext<IContextWarehouse>({
  state: initialState,
  dispatch: () => null
});

export default OrganizationContext;