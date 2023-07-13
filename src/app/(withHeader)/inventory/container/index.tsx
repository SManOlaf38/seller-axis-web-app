'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import Table from '../components/TableInventory';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { headerTable } from '../constants';
import IconAction from 'public/three-dots.svg';
import { useStore } from '../../product-aliases/context';
import {
  getProductAliasRequest,
  getProductAliasSuccess,
  getProductAliasFailure
} from '../../product-aliases/context/action';
import { ProductAlias } from '../interface';
import { getProductAliasService } from '../fetch';

export default function InventoryContainer() {
  const {
    state: { isLoading, dataProductAlias },
    dispatch: productAliasDispatch
  } = useStore();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataProductAlias?.results as []
  });
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const [dataInventory, setDataInventory] = useState<ProductAlias[]>(dataProductAlias?.results);
  const [changeQuantity, setChangeQuantity] = useState<any>({
    update_quantity: false,
    next_available_date: false,
    next_available_qty: false
  });

  const isValueUseLiveQuantity = useMemo(() => {
    return dataInventory?.some((item) => item?.is_live_data === true);
  }, [dataInventory]);

  const handleCancel = () => setChangeQuantity(false);

  const handleSaveChanges = () => {
    const body = dataInventory?.map((item) => ({
      id: item.id,
      is_live_data: item.is_live_data,
      merchant_sku: item.merchant_sku,
      sku: item.sku,
      vendor_sku: item.vendor_sku,

      retailer_warehouse_products: item?.retailer_warehouse_products?.map((itemWarehouse: any) => ({
        product_alias: itemWarehouse?.product_alias,
        product_warehouse_statices: {
          id: itemWarehouse.product_warehouse_statices.id,
          next_available_date: itemWarehouse.product_warehouse_statices.next_available_date,
          next_available_qty: itemWarehouse.product_warehouse_statices.next_available_qty,
          product_warehouse_id: itemWarehouse.product_warehouse_statices.product_warehouse_id,
          qty_on_hand: itemWarehouse.product_warehouse_statices.update_quantity,
          status: itemWarehouse.product_warehouse_statices.status
        },
        retailer_warehouse: {
          id: itemWarehouse.retailer_warehouse.id,
          address: itemWarehouse.retailer_warehouse.address,
          name: itemWarehouse.retailer_warehouse.name,
          retailer: itemWarehouse.retailer_warehouse.retailer
        }
      }))
    }));
  };

  const handleDownload = async () => {};

  const handleItemLive = () => {
    setChangeQuantity(false);
    setDataInventory((prevData) => {
      return prevData?.map((item) => {
        if (selectedItems?.includes(+item?.id)) {
          return {
            ...item,
            is_live_data: true
          };
        }
        return item;
      });
    });
  };

  const handleNotItemLive = () => {
    setChangeQuantity(true);
    setDataInventory((prevData) => {
      return prevData?.map((item) => {
        if (selectedItems?.includes(+item?.id)) {
          return {
            ...item,
            is_live_data: false
          };
        }
        return item;
      });
    });
  };

  const handleToggleLiveQuantity = (indexItem: number) => {
    setDataInventory((prevTableData) => {
      const updatedData = prevTableData?.map((item, i) =>
        i === indexItem
          ? {
              ...item,
              is_live_data: !item?.is_live_data
            }
          : item
      );
      return updatedData;
    });
  };

  const handleGetProductAlias = useCallback(async () => {
    try {
      productAliasDispatch(getProductAliasRequest());
      const dataProduct = await getProductAliasService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      productAliasDispatch(getProductAliasSuccess(dataProduct));
    } catch (error) {
      productAliasDispatch(getProductAliasFailure(error));
    }
  }, [productAliasDispatch, page, debouncedSearchTerm, rowsPerPage]);

  useEffect(() => {
    handleGetProductAlias();
  }, [handleGetProductAlias]);

  useEffect(() => {
    if (dataProductAlias) {
      setDataInventory(dataProductAlias?.results);
    }
  }, [dataProductAlias]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <div className="flex content-end items-center">
          <SubBar
            search={search}
            isDownload={true}
            onSearch={handleSearch}
            changeQuantity={changeQuantity}
            handleCancel={handleCancel}
            handleSaveChanges={handleSaveChanges}
          />
        </div>
        <div className="h-full">
          <Table
            columns={headerTable}
            isPagination
            isSelect={true}
            loading={isLoading}
            changeQuantity={changeQuantity}
            setChangeQuantity={setChangeQuantity}
            selectedItems={selectedItems}
            selectAllTable={onSelectAll}
            selectItemTable={onSelectItem}
            totalCount={10}
            siblingCount={1}
            onPageChange={onPageChange}
            currentPage={page}
            pageSize={rowsPerPage}
            dataInventory={dataInventory as ProductAlias[]}
            handleToggleLiveQuantity={handleToggleLiveQuantity}
            setDataInventory={setDataInventory}
            selectAction={
              <Dropdown
                className="left-3 top-[-10px] w-[180px] dark:bg-gunmetal"
                mainMenu={<IconAction />}
              >
                <div className="rounded-lg ">
                  <Button className="w-full hover:bg-neutralLight" onClick={handleItemLive}>
                    <span className="items-start text-lightPrimary  dark:text-santaGrey">
                      Use live inventory
                    </span>
                  </Button>
                  <Button
                    className={clsx('w-full', {
                      'hover:bg-neutralLight': isValueUseLiveQuantity
                    })}
                    onClick={handleNotItemLive}
                    disabled={!isValueUseLiveQuantity}
                  >
                    <span className="items-start text-lightPrimary dark:text-santaGrey">
                      Not use live inventory
                    </span>
                  </Button>
                  <Button className="w-full hover:bg-neutralLight" onClick={handleDownload}>
                    <span className="items-start text-lightPrimary  dark:text-santaGrey">
                      Download XML
                    </span>
                  </Button>
                </div>
              </Dropdown>
            }
          />
        </div>
      </div>
    </main>
  );
}
