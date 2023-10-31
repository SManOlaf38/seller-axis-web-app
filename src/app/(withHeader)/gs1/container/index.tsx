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

import { useStoreGs1 } from '../context';
import {
  deleteGs1Failure,
  deleteGs1Request,
  deleteGs1Success,
  getGs1Failure,
  getGs1Request,
  getGs1Success
} from '../context/action';
import { headerTable } from '../constants';
import { deleteGs1Service, getGs1Service } from '../fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

export default function Gs1Container() {
  const {
    state: { isLoading, dataGs1 },
    dispatch: Gs1Dispatch
  } = useStoreGs1();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const router = useRouter();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataGs1
  });

  const handleGetGs1 = useCallback(async () => {
    try {
      Gs1Dispatch(getGs1Request());
      const dataGs1 = await getGs1Service({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage
      });
      Gs1Dispatch(getGs1Success(dataGs1));
    } catch (error: any) {
      Gs1Dispatch(getGs1Failure(error));
    }
  }, [Gs1Dispatch, debouncedSearchTerm, page, rowsPerPage]);

  const handleViewDetailItem = useCallback(
    (id: number) => {
      router.push(`/gs1/${id}`);
    },
    [router]
  );

  const handleDeleteItem = async (id: number) => {
    try {
      Gs1Dispatch(deleteGs1Request());
      await deleteGs1Service(id);
      Gs1Dispatch(deleteGs1Success(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete GS1 Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetGs1();
    } catch (error: any) {
      Gs1Dispatch(deleteGs1Failure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete GS1 Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const renderBodyTable = useMemo(() => {
    return dataGs1?.map((item) => ({
      id: item.id || '',
      name: item.name || '-',
      gs1: item.gs1 || '-',
      created_at: dayjs(item.created_at).format('MM/DD/YYYY') || '-',
      action: (
        <div
          className="flex items-center justify-center"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute">
            <Dropdown mainMenu={<IconAction />} className="w-[160px] dark:bg-gunmetal">
              <div className="z-50 rounded-lg ">
                <Button onClick={() => handleDeleteItem(item.id)}>
                  <IconDelete />
                  <span className="items-start text-lightPrimary  dark:text-santaGrey">Delete</span>
                </Button>
              </div>
            </Dropdown>
          </div>
        </div>
      )
    }));
  }, [dataGs1, handleDeleteItem, handleViewDetailItem]);

  useEffect(() => {
    handleGetGs1();
  }, [handleGetGs1]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          isSearch={false}
          title={'GS1'}
          onSubmit={() => router.push('/gs1/create')}
          addTitle="Add GS1"
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
            totalCount={dataGs1?.length}
            siblingCount={1}
            onPageChange={onPageChange}
            onClickItem={(id) => router.push(`/gs1/${id}`)}
            currentPage={page + 1}
            pageSize={rowsPerPage}
            selectAction={
              <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
                <div className="rounded-lg">
                  <Button>
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
