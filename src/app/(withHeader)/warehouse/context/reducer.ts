import { CREATE_WAREHOUSE_FAIL, CREATE_WAREHOUSE_REQUEST, CREATE_WAREHOUSE_SUCCESS, DELETE_WAREHOUSE_FAIL, DELETE_WAREHOUSE_REQUEST, DELETE_WAREHOUSE_SUCCESS, GET_WAREHOUSE_FAIL, GET_WAREHOUSE_REQUEST, GET_WAREHOUSE_SUCCESS, UPDATE_WAREHOUSE_FAIL, UPDATE_WAREHOUSE_REQUEST, UPDATE_WAREHOUSE_SUCCESS } from "./constant";
import { IStateWareHouse } from "./type";

export const initialState: IStateWareHouse = {
  dataWarehouse: {
    count: 0,
    next: false,
    previous: false,
    results: [],
    total_page: 0,
  },
  isLoading: true,
  errorMessage: ''
}

function SearchReducer(state: IStateWareHouse, action: {
  type: string,
  payload: any,
}) {
  switch (action.type) {
    // GET
    case GET_WAREHOUSE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case GET_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload
      };
    }
    case GET_WAREHOUSE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    // CREATE
    case CREATE_WAREHOUSE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case CREATE_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload,
        errorMessage: ''
      };
    }
    case CREATE_WAREHOUSE_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // DELETE
    case DELETE_WAREHOUSE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case DELETE_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case DELETE_WAREHOUSE_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // UPDATE
    case UPDATE_WAREHOUSE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case UPDATE_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case UPDATE_WAREHOUSE_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

export default SearchReducer