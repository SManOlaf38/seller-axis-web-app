'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';

import DownIcon from 'public/angle-down-icon.svg';
import ImportIcon from 'public/import-icon.svg';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { TableProduct } from '../components/TableProduct';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import useToggleModal from '@/hooks/useToggleModal';
import ModalImportFile from '../components/ModalImportFile';
import { generateSimpleExcel } from '@/utils/utils';
import { Product } from '../interface';

export default function ProductContainer() {
  const {
    state: { isLoading, dataProduct },
    dispatch
  } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get('sort_by');

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataProduct?.results
  });
  const { openModal, handleToggleModal } = useToggleModal();

  const handleViewDetailItem = (id: number) => {
    router.push(`/products/${id}`);
  };

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteProductRequest());
      await services.deleteProductService(id);
      dispatch(actions.deleteProductSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Product Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProduct();
    } catch (error: any) {
      dispatch(actions.getProductFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Product Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetProduct = useCallback(async () => {
    try {
      dispatch(actions.getProductRequest());
      const dataProduct = await services.getProductService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage,
        sortBy: sortBy || '-created_at'
      });
      dispatch(actions.getProductSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm, rowsPerPage, sortBy]);

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      dispatch(actions.deleteBulkProductRequest());
      await services.deleteBulkProductService(ids);
      dispatch(actions.deleteBulkProductSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Product Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProduct();
    } catch (error: any) {
      dispatch(actions.deleteBulkProductFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Product Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const productSelect = useMemo(() => {
    return dataProduct?.results
      ?.filter((product) => selectedItems?.includes(+product?.id))
      .map((item: Product) => [
        item?.image || '-',
        item?.sku || '-',
        item?.unit_of_measure || '-',
        item?.available || '-',
        item?.upc || '-',
        item?.product_series?.series || '-',
        item?.unit_cost || '-',
        item?.weight_unit || '-',
        item?.qty_on_hand || '-',
        item?.qty_pending || '-',
        item.qty_reserve || '-',
        item.description || '-'
      ]);
  }, [dataProduct?.results, selectedItems]);

  const handleExportFile = (title: string) => {
    const headerRow = headerTable
      ?.filter((item) => item?.id !== 'created_at' && item?.id !== 'action')
      ?.map((item) => item?.label);

    const excelBlob = generateSimpleExcel(title === 'file' ? (productSelect as []) : [], headerRow);
    if (!excelBlob) {
      return;
    }

    const url = window.URL.createObjectURL(excelBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `product-${dayjs(new Date()).format('MM-DD-YYYY&h:mm A')}.xlsx`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    handleGetProduct();
  }, [handleGetProduct]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Product'}
          onSubmit={() => router.push('/products/create')}
          addTitle="Add Product"
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
                      'hover:bg-neutralLight': selectedItems.length !== 0
                    })}
                    onClick={() => handleExportFile('file')}
                    disabled={selectedItems.length === 0}
                  >
                    Export File
                  </Button>
                </div>
              </Dropdown>

              <Button
                onClick={handleToggleModal}
                color="dark:bg-gunmetal bg-paperLight"
                className="flex justify-center border border-dodgeBlue text-dodgeBlue"
              >
                <ImportIcon />
                Import
              </Button>
            </div>
          }
        />

        <TableProduct
          headerTable={headerTable}
          loading={isLoading}
          dataProduct={dataProduct}
          selectedItems={selectedItems}
          totalCount={dataProduct.count}
          page={page + 1}
          rowsPerPage={rowsPerPage}
          onSelectAll={onSelectAll}
          onSelectItem={onSelectItem}
          onPageChange={onPageChange}
          onViewDetailItem={handleViewDetailItem}
          onDeleteItem={handleDeleteItem}
          onChangePerPage={onChangePerPage}
          handleDeleteBulkItem={handleDeleteBulkItem}
        />
      </div>
      <ModalImportFile
        open={openModal}
        onClose={handleToggleModal}
        handleGetProduct={handleGetProduct}
      />
    </main>
  );
}
