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
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

import { useStoreBox } from '../context';
import {
  deleteBoxFailure,
  deleteBoxRequest,
  deleteBoxSuccess,
  getBoxFailure,
  getBoxRequest,
  getBoxSuccess
} from '../context/action';
import { headerTable } from '../constants';
import { BoxItemActionMenu } from '../components/PackageRuleItemActionMenu';
import { deleteBoxService, getBoxService } from '../fetch';

export default function BoxContainer() {
  const {
    state: { isLoading, dataBox },
    dispatch: boxDispatch
  } = useStoreBox();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange, onChangePerPage } = usePagination();
  const router = useRouter();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataBox?.results
  });

  const handleGetBox = useCallback(async () => {
    try {
      boxDispatch(getBoxRequest());
      const dataBox = await getBoxService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage,
        product_id: ''
      });
      boxDispatch(getBoxSuccess(dataBox));
    } catch (error: any) {
      boxDispatch(getBoxFailure(error));
    }
  }, [boxDispatch, debouncedSearchTerm, page, rowsPerPage]);

  const handleViewDetailItem = useCallback(
    (id: number) => {
      router.push(`/box/${id}`);
    },
    [router]
  );

  const handleDeleteItem = async (id: number) => {
    try {
      boxDispatch(deleteBoxRequest());
      await deleteBoxService(id);
      boxDispatch(deleteBoxSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Box Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetBox();
    } catch (error: any) {
      boxDispatch(deleteBoxFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Box Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const renderBodyTable = useMemo(() => {
    return dataBox?.results?.map((item) => ({
      id: item.id || '',
      name: item.name || '-',
      length: item.length || '-',
      wight: item.width || '-',
      height: item.height || '-',
      dimension_unit: item.dimension_unit || '-',
      created_at: dayjs(item.created_at).format('MM/DD/YYYY') || '-',
      action: (
        <div
          className="flex items-center justify-center"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute">
            <BoxItemActionMenu
              row={item}
              onViewDetailItem={handleViewDetailItem}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      )
    }));
  }, [dataBox?.results, handleDeleteItem, handleViewDetailItem]);

  useEffect(() => {
    handleGetBox();
  }, [handleGetBox]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Box'}
          onSubmit={() => router.push('/box/create')}
          addTitle="Add Box"
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
            totalCount={dataBox?.count}
            siblingCount={1}
            onPageChange={onPageChange}
            onClickItem={(id) => router.push(`/box/${id}`)}
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
