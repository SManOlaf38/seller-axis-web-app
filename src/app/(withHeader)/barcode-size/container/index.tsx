/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';

import IconAction from 'public/three-dots.svg';
import IconDelete from 'public/delete.svg';
import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { Table } from '@/components/ui/Table';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import useSelectTable from '@/hooks/useSelectTable';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStoreBarcodeSize } from '../context';
import {
  deleteBarcodeSizeFailure,
  deleteBarcodeSizeRequest,
  deleteBarcodeSizeSuccess,
  deleteBulkBarcodeSizeFailure,
  deleteBulkBarcodeSizeRequest,
  deleteBulkBarcodeSizeSuccess,
  getBarcodeSizeFailure,
  getBarcodeSizeRequest,
  getBarcodeSizeSuccess
} from '../context/action';
import { headerTable } from '../constants';
import { BarcodeSizeItemActionMenu } from '../components/BarcodeSizeItemActionMenu';
import {
  deleteBarcodeSizeService,
  deleteBulkBarcodeSizeService,
  getBarcodeSizeService
} from '../fetch';

export default function BarcodeSizeContainer() {
  const {
    state: { isLoading, dataBarcodeSize },
    dispatch: BarcodeSizeDispatch
  } = useStoreBarcodeSize();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const router = useRouter();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataBarcodeSize?.results
  });

  const handleGetBarcodeSize = useCallback(async () => {
    try {
      BarcodeSizeDispatch(getBarcodeSizeRequest());
      const dataBarcodeSize = await getBarcodeSizeService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage
      });
      BarcodeSizeDispatch(getBarcodeSizeSuccess(dataBarcodeSize));
    } catch (error: any) {
      BarcodeSizeDispatch(getBarcodeSizeFailure(error));
    }
  }, [BarcodeSizeDispatch, debouncedSearchTerm, page, rowsPerPage]);

  const handleViewDetailItem = useCallback(
    (id: number) => {
      router.push(`/barcode-size/${id}`);
    },
    [router]
  );

  const handleDeleteItem = async (id: number) => {
    try {
      BarcodeSizeDispatch(deleteBarcodeSizeRequest());
      await deleteBarcodeSizeService(id);
      BarcodeSizeDispatch(deleteBarcodeSizeSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Barcode Size Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetBarcodeSize();
    } catch (error: any) {
      BarcodeSizeDispatch(deleteBarcodeSizeFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Barcode Size Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleDeleteBulkItem = async (ids: number[]) => {
    try {
      BarcodeSizeDispatch(deleteBulkBarcodeSizeRequest());
      await deleteBulkBarcodeSizeService(ids);
      BarcodeSizeDispatch(deleteBulkBarcodeSizeSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Barcode Size Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetBarcodeSize();
    } catch (error: any) {
      BarcodeSizeDispatch(deleteBulkBarcodeSizeFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Barcode Size Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const renderBodyTable = useMemo(() => {
    return dataBarcodeSize?.results?.map((item) => ({
      id: item.id || '',
      name: item.name || '-',
      width: item.width || '-',
      height: item.height || '-',
      multiple_per_label: (
        <div className="flex justify-center">
          {item.multiple_per_label ? (
            <div className="flex min-w-[67px] items-center justify-center rounded-full bg-greenLight px-[2px] py-[4px] text-[#429777] dark:text-[#67BB9B]">
              Use
            </div>
          ) : (
            <div className="dark:bg-redDark flex min-w-[67px] items-center justify-center rounded-full bg-redLight px-[2px] py-[4px] text-[#CE170A] dark:text-[#DF4F45]">
              Not Use
            </div>
          )}
        </div>
      ),
      created_at: dayjs(item.created_at).format('MM/DD/YYYY') || '-',
      action: (
        <div
          className="flex items-center justify-center"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute">
            <BarcodeSizeItemActionMenu
              row={item}
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      )
    }));
  }, [dataBarcodeSize?.results, handleDeleteItem, handleViewDetailItem]);

  useEffect(() => {
    handleGetBarcodeSize();
  }, [handleGetBarcodeSize]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Barcode Size'}
          onSubmit={() => router.push('/barcode-size/create')}
          addTitle="Add Barcode Size"
        />
        <div className="h-full">
          <Table
            onChangePerPage={onChangePerPage}
            columns={headerTable}
            loading={isLoading}
            rows={renderBodyTable}
            isPagination
            isSelect={true}
            selectedItems={selectedItems}
            selectAllTable={onSelectAll}
            selectItemTable={onSelectItem}
            totalCount={dataBarcodeSize?.count}
            siblingCount={1}
            onPageChange={onPageChange}
            onClickItem={(id) => router.push(`/barcode-size/${id}`)}
            currentPage={page + 1}
            pageSize={rowsPerPage}
            selectAction={
              <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
                <div className="rounded-lg">
                  <Button onClick={() => handleDeleteBulkItem(selectedItems)}>
                    <IconDelete />
                    <span className="items-start text-lightPrimary  dark:text-santaGrey">
                      Delete
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
