
import { Dispatch } from 'react';

export type IStateWareHouse = {
  dataWarehouse: {
    count: number,
    next: boolean | null,
    previous: boolean | null,
    results: any[],
    total_page: number,
  };
  isLoading: boolean;
  errorMessage: string;
}

export type IContextWarehouse = {
  state: IStateWareHouse;
  dispatch: Dispatch<any>;
}
