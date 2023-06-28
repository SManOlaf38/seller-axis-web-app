'use client'

import { createContext } from 'react';

import { initialState } from './reducer';
import { IContextWarehouse } from './type';

const WarehouseContext = createContext<IContextWarehouse>({
  state: initialState,
  dispatch: () => null
});


export default WarehouseContext;