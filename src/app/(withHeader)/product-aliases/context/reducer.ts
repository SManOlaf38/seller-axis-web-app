import type { ProductAliasStateType } from '../interface';
import * as constants from './constant';

export const initialState: ProductAliasStateType = {
  dataProductAlias: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  isLoadingProductWarehouse: false,
  isLoadingUpdateProductStatic: false,
  isLoadingUpdateLive: false,
  isLoadingDownloadInventory: false,
  error: '',
  dataRetailer: [],
  dataProductAliasDetail: {
    created_at: '',
    id: '',
    merchant_sku: '',
    product: {
      id: '',
      sku: '',
      unit_of_measure: '',
      available: '',
      upc: '',
      description: '',
      unit_cost: 0,
      qty_on_hand: 0,
      qty_reserve: 0,
      qty_pending: 0,
      image: '',
      created_at: '',
      update_at: '',
      organization: '',
      product_series: {
        id: '',
        created_at: '',
        series: '',
        updated_at: '',
        package_rules: []
      },
      weight_unit: ''
    },
    retailer: {
      created_at: '',
      id: '',
      name: '',
      organization: '',
      type: '',
      updated_at: ''
    },
    upc: '',
    sku: '',
    vendor_sku: '',
    updated_at: ''
  }
};

function ProductAliasReducer(
  state: ProductAliasStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductAlias: action.payload
      };
    }
    case constants.GET_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_PRODUCT_ALIAS_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_ALIAS_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductAliasDetail: action.payload
      };
    }
    case constants.GET_PRODUCT_ALIAS_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.CREATE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.UPDATE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.UPDATE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.UPDATE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.UPDATE_PRODUCT_STATIC_BULK_REQUEST: {
      return {
        ...state,
        isLoadingUpdateProductStatic: true,
        error: ''
      };
    }
    case constants.UPDATE_PRODUCT_STATIC_BULK_SUCCESS: {
      return {
        ...state,
        isLoadingUpdateProductStatic: false
      };
    }
    case constants.UPDATE_PRODUCT_STATIC_BULK_FAIL: {
      return {
        ...state,
        isLoadingUpdateProductStatic: false,
        error: action.payload
      };
    }

    case constants.DELETE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_RETAILER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataRetailer: action.payload
      };
    }
    case constants.GET_RETAILER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_PRODUCT_WAREHOUSE_REQUEST: {
      return {
        ...state,
        isLoadingProductWarehouse: true
      };
    }
    case constants.CREATE_PRODUCT_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoadingProductWarehouse: false
      };
    }
    case constants.CREATE_PRODUCT_WAREHOUSE_FAIL: {
      return {
        ...state,
        isLoadingProductWarehouse: false
      };
    }

    case constants.UPDATE_LIVE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoadingUpdateLive: true,
        error: ''
      };
    }
    case constants.UPDATE_LIVE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoadingUpdateLive: false
      };
    }
    case constants.UPDATE_LIVE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoadingUpdateLive: false,
        error: action.payload
      };
    }

    case constants.DOWNLOAD_INVENTORY_REQUEST: {
      return {
        ...state,
        isLoadingDownloadInventory: true
      };
    }
    case constants.DOWNLOAD_INVENTORY_SUCCESS: {
      return {
        ...state,
        isLoadingDownloadInventory: false
      };
    }
    case constants.DOWNLOAD_INVENTORY_FAIL: {
      return {
        ...state,
        isLoadingDownloadInventory: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default ProductAliasReducer;
