'use client';

import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useStore as useStoreRetailer } from '@/app/(withHeader)/retailers/context';
import * as actionsRetailer from '@/app/(withHeader)/retailers/context/action';
import * as servicesRetailer from '@/app/(withHeader)/retailers/fetch';
import { SubBar } from '@/components/common/SubBar';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import DownLoadIcon from 'public/download.svg';
import { TableOrder } from '../components/TableOrder';
import { filterStatus, headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';
import { ListOrder, Order } from '../interface';
import ResultBulkShip from '../components/ResultBulkShip';
import ResultBulkAcknowledge from '../components/ResultBulkAcknowledge';
import ResultBulkVerify from '../components/ResultBulkVerify';

export type Options = { label: string; value: string };

export default function OrderContainer() {
  const {
    state: {
      isLoading,
      dataOrder,
      isLoadingNewOrder,
      countNewOrder,
      isLoadingAcknowledge,
      isLoadingShipment,
      isLoadingVerifyBulk,
      isLoadingByPass
    },
    dispatch
  } = useStore();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const status = searchParams.get('status');
  const retailer = searchParams.get('retailer');
  const sortBy = searchParams.get('sort_by');

  const {
    state: { dataRetailer, isLoadMoreRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const { dispatch: dispatchAlert } = useStoreAlert();
  const { search, debouncedSearchTerm, handleSearch } = useSearch('orders');
  const { debouncedSearchTerm: debouncedSearchTermRetailer, handleSearch: handleSearchRetailer } =
    useSearch('retailers');
  const { page, rowsPerPage, onPageChange, onChangePerPage, setCurrentPage } = usePagination();
  const { page: pageRetailer, onPageChange: onPageChangeRetailer } = usePagination();

  const { selectedItems, onSelectAll, onSelectItem, selectedItemObjects } = useSelectTable({
    data: dataOrder?.results
  });

  const [filter, setFilter] = useState<{
    status: Options | null;
    retailer: Options | null;
  }>({
    status: null,
    retailer: null
  });
  const [resBulkShip, setResBulkShip] = useState([]);
  const [resBulkAcknowledge, setResBulkAcknowledge] = useState([]);
  const [resBulkVerify, setBulkVerify] = useState([]);
  const [isOpenResult, setIsOpenResult] = useState({ isOpen: false, name: '' });

  const itemsNotInvoiced = useMemo(() => {
    return selectedItemObjects?.filter((item: Order) => item?.status !== 'Invoiced');
  }, [selectedItemObjects]);

  const itemsNotShipped = useMemo(() => {
    return selectedItemObjects?.filter(
      (item: Order) => item?.status !== 'Shipped' && item?.status !== 'Bypassed Acknowledge'
    );
  }, [selectedItemObjects]);

  const handleChangeFilter = (name: string, value: Options) => {
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleClearFilter = async () => {
    setFilter({
      status: null,
      retailer: null
    });
    params.delete('retailer');
    params.delete('status');
    router.push(`${pathname}?${params}`);
  };

  const handleViewDetailItem = (id: number) => {
    router.push(`/orders/${id}`);
  };

  const handleGetCountNewOrder = useCallback(async () => {
    try {
      dispatch(actions.getCountNewOrderRequest());
      const dataOrder = await services.getCountNewOrderService();

      dispatch(actions.getCountNewOrderSuccess(dataOrder));
    } catch (error) {
      dispatch(actions.getCountNewOrderFailure(error));
    }
  }, [dispatch]);

  const handleGetOrder = useCallback(async () => {
    try {
      dispatch(actions.getOrderRequest());
      const dataOrder = await services.getOrderService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage,
        status: status || '',
        retailer: retailer || '',
        sortBy: sortBy || '-created_at'
      });
      dispatch(actions.getOrderSuccess(dataOrder));
    } catch (error: any) {
      dispatch(actions.getOrderFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Something went wrong',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  }, [dispatch, debouncedSearchTerm, page, rowsPerPage, status, retailer, dispatchAlert, sortBy]);

  const handleGetNewOrder = useCallback(async () => {
    try {
      dispatch(actions.getNewOrderRequest());
      const dataOrder = await services.getNewOrderService();
      dispatch(actions.getNewOrderSuccess(dataOrder));
      handleGetOrder();
      handleGetCountNewOrder();
    } catch (error) {
      dispatch(actions.getNewOrderFailure(error));
    }
  }, [dispatch, handleGetCountNewOrder, handleGetOrder]);

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

  const totalNewOrder = useMemo(() => {
    return countNewOrder.retailers?.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue.count,
      0
    );
  }, [countNewOrder.retailers]);

  const handleAcknowledge = async () => {
    try {
      setIsOpenResult({ isOpen: true, name: 'BulkAcknowledge' });
      dispatch(actions.createAcknowledgeBulkRequest());
      const res = await services.createAcknowledgeBulkService(
        itemsNotShipped?.map((item: Order) => +item.id)
      );
      dispatch(actions.createAcknowledgeBulkSuccess());
      setResBulkAcknowledge(res);
      handleGetOrder();
    } catch (error: any) {
      setIsOpenResult({ isOpen: false, name: '' });
      dispatch(actions.createAcknowledgeFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Bulk Acknowledge Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleByPassAll = async () => {
    const dataByPass = resBulkAcknowledge?.filter(
      (item: { id: number; status: string }) => item?.status === 'FAILED'
    );
    try {
      dispatch(actions.byPassRequest());
      await services.byPassService(
        dataByPass?.map((item: { id: number; status: string }) => +item?.id) as never
      );
      dispatch(actions.byPassFromSuccess());
      handleGetOrder();
    } catch (error: any) {
      dispatch(actions.byPassFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'ByPass Acknowledge Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleByPassOneItem = async (order_id: number) => {
    try {
      dispatch(actions.byPassRequest());
      await services.byPassService(order_id);
      dispatch(actions.byPassFromSuccess());
      handleGetOrder();
    } catch (error: any) {
      dispatch(actions.byPassFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'ByPass Acknowledge Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleBulkVerify = async () => {
    try {
      setIsOpenResult({ isOpen: true, name: 'BulkVerify' });
      dispatch(actions.verifyBulkRequest());
      const res = await services.verifyAddBulkService(
        selectedItemObjects?.map((item: Order) => +item.id)
      );
      dispatch(actions.verifyBulkSuccess());
      setBulkVerify(res);
      handleGetOrder();
    } catch (error: any) {
      setIsOpenResult({ isOpen: false, name: '' });
      dispatch(actions.verifyBulkFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Bulk Verify Address Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleFilter = async () => {
    try {
      setCurrentPage(0);
      params.set('retailer', filter?.retailer?.label || '');
      params.set('status', filter?.status?.value || '');
      router.push(`${pathname}?${params}`);
      dispatch(actions.getOrderRequest());
      const dataOrder = await services.getOrderService({
        search: debouncedSearchTerm,
        page: 0,
        rowsPerPage,
        status: filter?.status?.value || '',
        retailer: filter?.retailer?.label || '',
        sortBy: sortBy || '-created_at'
      });
      dispatch(actions.getOrderSuccess(dataOrder));
    } catch (error) {
      dispatch(actions.getOrderFailure(error));
    }
  };

  const handleShip = async () => {
    const body = itemsNotInvoiced?.map((item: Order) => ({
      id: item.id,
      carrier: item.shipping_service?.code
        ? item.carrier?.id
        : item.batch?.retailer?.default_carrier?.id,
      shipping_service:
        item.shipping_service?.code ||
        item.batch?.retailer?.default_carrier?.default_service_type?.code,
      shipping_ref_1: item.shipping_ref_1,
      shipping_ref_2: item.shipping_ref_2,
      shipping_ref_3: item.shipping_ref_3,
      shipping_ref_4: item.shipping_ref_4,
      shipping_ref_5: item.shipping_ref_5,
      gs1: item?.gs1?.id
    })) as never;
    try {
      setIsOpenResult({ isOpen: true, name: 'BulkShip' });
      dispatch(actions.shipBulkRequest());
      const res = await services.shipBulkService(body);
      dispatch(actions.shipBulkSuccess());
      setResBulkShip(res);
      handleGetOrder();
    } catch (error: any) {
      setIsOpenResult({ isOpen: false, name: '' });
      dispatch(actions.shipBulkFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.errors?.[0]?.message || 'Ship Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleCloseBulkShip = () => {
    setResBulkShip([]);
    setIsOpenResult({ isOpen: false, name: '' });
  };

  const handleCloseBulkAcknowledge = () => {
    setResBulkAcknowledge([]);
    setIsOpenResult({ isOpen: false, name: '' });
  };

  const handleCloseBulkVerify = () => {
    setBulkVerify([]);
    setIsOpenResult({ isOpen: false, name: '' });
  };

  const handleViewMoreRetailer = async () => {
    const currentPage = pageRetailer + 1;
    try {
      dispatchRetailer(actionsRetailer.getLoadMoreRetailerRequest());
      const res = await servicesRetailer.getRetailerService({
        search: debouncedSearchTermRetailer || '',
        page: currentPage,
        rowsPerPage: 10
      });
      dispatchRetailer(actionsRetailer.getLoadMoreRetailerSuccess(res));
      onPageChangeRetailer(currentPage + 1);
    } catch (error: any) {
      dispatchRetailer(actionsRetailer.getLoadMoreRetailerFailure(error));
    }
  };

  useEffect(() => {
    handleGetOrder();
    handleGetCountNewOrder();
  }, [handleGetCountNewOrder, handleGetOrder]);

  useEffect(() => {
    handleGetRetailer();
  }, [handleGetRetailer]);

  useEffect(() => {
    setFilter({
      status: {
        label: status || '',
        value: status || ''
      },
      retailer: {
        label: retailer || '',
        value: retailer || ''
      }
    });
  }, [status, retailer]);

  useEffect(() => {
    const updatedResBulkAcknowledge = resBulkAcknowledge?.map((item: { id: number }) => {
      const matchingDataOrderItem = dataOrder?.results?.find(
        (dataItem: Order) =>
          dataItem?.id === item?.id && dataItem?.status === 'Bypassed Acknowledge'
      );
      if (matchingDataOrderItem) {
        return {
          ...item,
          status: matchingDataOrderItem?.status
        };
      }
      return item;
    });

    setResBulkAcknowledge(updatedResBulkAcknowledge as never);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataOrder]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Orders'}
          isActiveFilter
          filterContent={
            <div className="grid gap-2">
              <Autocomplete
                options={filterStatus}
                addNew={false}
                label="Status"
                name="status"
                placeholder="Select Status"
                value={filter.status}
                onChange={(value: Options) => handleChangeFilter('status', value)}
              />
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
                handleViewMore={handleViewMoreRetailer}
                isLoadMore={isLoadMoreRetailer}
                disableLodMore={dataRetailer?.next}
              />

              <div className="mt-2 grid w-full grid-cols-2 gap-2">
                <Button
                  onClick={handleClearFilter}
                  color="dark:bg-gunmetal bg-buttonLight"
                  className="flex justify-center"
                >
                  Clear
                </Button>
                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={handleFilter}
                  className="flex justify-center bg-dodgerBlue"
                >
                  Apply
                </Button>
              </div>
            </div>
          }
          otherAction={
            <div
              className={clsx(
                'mr-2 flex cursor-pointer items-center rounded-md bg-paperLight px-3 text-sm dark:bg-gunmetal',
                {
                  'opacity-60': isLoading || isLoadingNewOrder || totalNewOrder === 0
                }
              )}
            >
              <Button
                isLoading={isLoading || isLoadingNewOrder}
                disabled={isLoading || isLoadingNewOrder || totalNewOrder === 0}
                onClick={handleGetNewOrder}
                endIcon={<DownLoadIcon className="ml-2" />}
              >
                <span className={clsx('underline')}>{totalNewOrder}</span> New orders batch{' '}
              </Button>
            </div>
          }
        />

        <div className="h-full">
          <TableOrder
            itemsNotInvoiced={itemsNotInvoiced}
            itemsNotShipped={itemsNotShipped}
            isLoadingAcknowledge={isLoadingAcknowledge}
            isLoadingShipment={isLoadingShipment}
            handleBulkVerify={handleBulkVerify}
            isLoadingVerifyBulk={isLoadingVerifyBulk}
            headerTable={headerTable}
            loading={isLoading}
            dataOrder={dataOrder}
            selectedItems={selectedItems}
            totalCount={dataOrder.count}
            page={page}
            rowsPerPage={rowsPerPage}
            onSelectAll={onSelectAll}
            onSelectItem={onSelectItem}
            onPageChange={onPageChange}
            onViewDetailItem={handleViewDetailItem}
            handleAcknowledge={handleAcknowledge}
            handleShip={handleShip}
            onChangePerPage={onChangePerPage}
          />
        </div>
      </div>
      {isOpenResult.name === 'BulkShip' && (
        <ResultBulkShip
          isLoadingShipment={isLoadingShipment}
          resBulkShip={resBulkShip}
          handleCloseBulkShip={handleCloseBulkShip}
        />
      )}
      {isOpenResult.name === 'BulkAcknowledge' && (
        <ResultBulkAcknowledge
          isLoadingAcknowledge={isLoadingAcknowledge}
          resBulkAcknowledge={resBulkAcknowledge}
          handleCloseBulkAcknowledge={handleCloseBulkAcknowledge}
          handleByPassAll={handleByPassAll}
          handleByPassOneItem={handleByPassOneItem}
          isLoadingByPass={isLoadingByPass}
          isLoadingTable={isLoading}
        />
      )}
      {isOpenResult.name === 'BulkVerify' && (
        <ResultBulkVerify
          isLoadingVerifyBulk={isLoadingVerifyBulk}
          resBulkVerify={resBulkVerify}
          handleCloseBulkVerify={handleCloseBulkVerify}
        />
      )}
    </main>
  );
}
