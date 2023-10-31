'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import DownIcon from 'public/angle-down-icon.svg';
import ImportIcon from 'public/import-icon.svg';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TableProductAlias } from '../components/TableProductAlias';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch/index';
import { Button } from '@/components/ui/Button';
import { headerProductAliasCSV } from '@/constants';
import { DataFileDownload, ProductAlias, RetailerWarehouseProduct } from '../interface';
import { Dropdown } from '@/components/ui/Dropdown';
import ModalImportFile from '../components/ModalImportFile';
import { generateExcelData } from '@/utils/utils';
import { Options } from '../../orders/containers';
import Autocomplete from '@/components/ui/Autocomplete';
import { useStore as useStoreRetailer } from '@/app/(withHeader)/retailers/context';
import * as actionsRetailer from '@/app/(withHeader)/retailers/context/action';
import * as servicesRetailer from '@/app/(withHeader)/retailers/fetch';

export default function ProductAliasContainer() {
  const {
    state: { isLoading, dataProductAlias },
    dispatch
  } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sortBy = searchParams.get('sort_by');
  const retailer = searchParams.get('retailer');
  const params = new URLSearchParams(searchParams);
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataProductAlias?.results as []
  });
  const [openModalFile, setOpenModalFile] = useState<boolean>(false);

  const { debouncedSearchTerm: debouncedSearchTermRetailer, handleSearch: handleSearchRetailer } =
    useSearch();

  const [filter, setFilter] = useState<{
    retailer: Options | null;
  }>({
    retailer: null
  });

  const productAliasSelect = useMemo(() => {
    return dataProductAlias?.results
      ?.filter((product) => selectedItems?.includes(+product?.id))
      ?.flatMap((item: ProductAlias) => {
        if (item?.retailer_warehouse_products && item?.retailer_warehouse_products?.length > 0) {
          return item?.retailer_warehouse_products?.map(
            (warehouseProduct: RetailerWarehouseProduct) => ({
              sku: item?.sku || '-',
              product: item?.product?.sku || '-',
              sku_quantity: item?.sku_quantity || '-',
              merchant_sku: item?.merchant_sku || '-',
              vendor_sku: item?.vendor_sku || '-',
              retailer: item?.retailer?.name || '-',
              merchant_id: item?.retailer?.merchant_id || '-',
              upc: item?.upc || '-',

              retailer_warehouse: warehouseProduct?.retailer_warehouse?.name || '-',
              qty_on_hand: warehouseProduct?.product_warehouse_statices?.qty_on_hand || '-',
              next_available_qty:
                warehouseProduct?.product_warehouse_statices?.next_available_qty || '-',
              next_available_date: warehouseProduct?.product_warehouse_statices?.next_available_date
                ? new Date(warehouseProduct?.product_warehouse_statices?.next_available_date)
                : '-'
            })
          );
        } else {
          return [
            {
              sku: item?.sku || '-',
              product: item?.product?.sku || '-',
              sku_quantity: item?.sku_quantity || '-',
              merchant_sku: item?.merchant_sku || '-',
              vendor_sku: item?.vendor_sku || '-',
              retailer: item?.retailer?.name || '-',
              merchant_id: item?.retailer?.merchant_id || '-',
              upc: item?.upc || '-',

              retailer_warehouse: '-',
              qty_on_hand: '-',
              next_available_qty: '-',
              next_available_date: '-'
            }
          ];
        }
      });
  }, [dataProductAlias?.results, selectedItems]);

  const handleExportFile = (title: string) => {
    const excelBlob = generateExcelData(
      title === 'file' ? (productAliasSelect as DataFileDownload[]) : [],
      headerProductAliasCSV
    );
    if (!excelBlob) {
      return;
    }

    const url = window.URL.createObjectURL(excelBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `product-alias-${dayjs(new Date()).format('MM-DD-YYYY&h:mm A')}.xlsx`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleViewDetailItem = (id: number) => {
    router.push(`/product-aliases/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteProductAliasRequest());
      await services.deleteProductAliasService(id);
      dispatch(actions.deleteProductAliasSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Products Alias Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProductAlias();
    } catch (error: any) {
      dispatch(actions.deleteProductAliasFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Products Alias Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetProductAlias = useCallback(async () => {
    try {
      dispatch(actions.getProductAliasRequest());
      const dataProduct = await services.getProductAliasService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage,
        sortBy: sortBy || '-created_at',
        retailer: retailer || ''
      });
      dispatch(actions.getProductAliasSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductAliasFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage, sortBy, retailer]);

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkProductAliasRequest());
      await services.deleteBulkProductAliasService(ids);
      dispatch(actions.deleteBulkProductAliasSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Products Alias Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProductAlias();
    } catch (error: any) {
      dispatch(actions.deleteBulkProductAliasFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Products Alias Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const {
    state: { dataRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const handleGetRetailer = useCallback(async () => {
    try {
      dispatchRetailer(actionsRetailer.getRetailerRequest());
      const res = await servicesRetailer.getRetailerService({
        search: debouncedSearchTermRetailer || '',
        page: 0,
        rowsPerPage: 10
      });
      dispatchRetailer(actionsRetailer.getRetailerSuccess(res));
    } catch (error: any) {
      dispatchRetailer(actionsRetailer.getRetailerFailure(error));
    }
  }, [dispatchRetailer, debouncedSearchTermRetailer]);

  const handleFilter = async () => {
    try {
      params.set('retailer', filter?.retailer?.label || '');
      router.push(`${pathname}?${params}`);
      dispatch(actions.getProductAliasRequest());
      const dataProduct = await services.getProductAliasService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage,
        sortBy: sortBy || '-created_at',
        retailer: filter.retailer?.label || ''
      });
      dispatch(actions.getProductAliasSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductAliasFailure(error));
    }
  };

  const handleChangeFilter = (name: string, value: Options) => {
    setFilter({
      ...filter,
      [name]: value
    });
  };

  useEffect(() => {
    handleGetProductAlias();
  }, [handleGetProductAlias]);

  useEffect(() => {
    handleGetRetailer();
  }, [handleGetRetailer]);

  const handleClearFilter = async () => {
    setFilter({
      retailer: null
    });
    handleGetProductAlias();
    params.delete('retailer');
    router.push(`${pathname}?${params}`);
  };

  useEffect(() => {
    setFilter({
      retailer: {
        label: retailer || '',
        value: retailer || ''
      }
    });
  }, [retailer]);

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Product Alias'}
        onSubmit={() => router.push('/product-aliases/create')}
        addTitle="Add Product Alias"
        isActiveFilter
        otherAction={
          <div className="flex items-center justify-center">
            <Dropdown
              className="left-0 min-w-[129px] bg-paperLight shadow-lg dark:bg-darkGreen"
              mainMenu={
                <div className="mr-2 flex h-8 cursor-pointer items-center justify-center rounded-md border border-dodgeBlue bg-paperLight px-3 py-2 text-center text-sm font-normal text-dodgeBlue opacity-90 dark:bg-gunmetal">
                  Export
                  <DownIcon />
                </div>
              }
            >
              <div className="rounded-lg p-1">
                <Button
                  className="w-full text-lightPrimary hover:bg-neutralLight dark:text-santaGrey"
                  onClick={() => handleExportFile('template')}
                >
                  Get Template
                </Button>
                <Button
                  className={clsx('w-full text-lightPrimary dark:text-santaGrey', {
                    'hover:bg-neutralLight': productAliasSelect.length !== 0
                  })}
                  onClick={() => handleExportFile('file')}
                  disabled={productAliasSelect.length === 0}
                >
                  Export File
                </Button>
              </div>
            </Dropdown>

            <Button
              onClick={() => setOpenModalFile(true)}
              color="dark:bg-gunmetal bg-paperLight"
              className="flex justify-center border border-dodgeBlue text-dodgeBlue"
            >
              <ImportIcon />
              Import
            </Button>
          </div>
        }
        filterContent={
          <div className="grid gap-2">
            <Autocomplete
              options={dataRetailer.results.map((item) => ({
                label: item.name,
                value: item.id
              }))}
              handleChangeText={handleSearchRetailer}
              addNew={false}
              label="Retailer"
              name="retailer"
              placeholder="Select Retailer"
              value={filter.retailer}
              onChange={(value: Options) => handleChangeFilter('retailer', value)}
            />

            <div className="mt-2 grid w-full grid-cols-2 gap-2">
              <Button
                onClick={handleClearFilter}
                color="dark:bg-gunmetal bg-buttonLight"
                className="flex justify-center "
              >
                Clear
              </Button>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                onClick={handleFilter}
                className="flex justify-center bg-dodgerBlue text-white"
              >
                Apply
              </Button>
            </div>
          </div>
        }
      />

      <TableProductAlias
        headerTable={headerTable}
        onChangePerPage={onChangePerPage}
        loading={isLoading}
        dataProduct={dataProductAlias}
        selectedItems={selectedItems}
        totalCount={dataProductAlias.count}
        page={page}
        rowsPerPage={rowsPerPage}
        onSelectAll={onSelectAll}
        onSelectItem={onSelectItem}
        onPageChange={onPageChange}
        onViewDetailItem={handleViewDetailItem}
        onDeleteItem={handleDeleteItem}
        handleDeleteBulkItem={handleDeleteBulkItem}
      />

      <ModalImportFile open={openModalFile} onClose={() => setOpenModalFile(false)} />
    </main>
  );
}
