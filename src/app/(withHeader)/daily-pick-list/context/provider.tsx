'use client';

import { useReducer, ReactNode } from 'react';
import DailyPickListReducer, { initialState } from './reducer';
import DailyPickListContext from './context';

function DailyPickListProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(DailyPickListReducer, initialState);

  return (
    <DailyPickListContext.Provider value={{ state, dispatch }}>
      {children}
    </DailyPickListContext.Provider>
  );
}

export default DailyPickListProvider;
