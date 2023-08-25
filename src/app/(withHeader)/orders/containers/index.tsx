'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Order } from '../interface';
import ResultBulkShip from '../components/ResultBulkShip';
import ResultBulkAcknowledge from '../components/ResultBulkAcknowledge';
import ResultBulkVerify from '../components/ResultBulkVerify';

type Options = { label: string; value: string };

export default function OrderContainer() {
  const {
    state: {
      isLoading,
      dataOrder,
      isLoadingNewOrder,
      countNewOrder,
      isLoadingAcknowledge,
      isLoadingShipment,
      isLoadingVerifyBulk
    },
    dispatch
  } = useStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  const status = searchParams.get('status');
  const retailer = searchParams.get('retailer');

  const {
    state: { dataRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const { dispatch: dispatchAlert } = useStoreAlert();
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
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

  const itemsNotInvoiced = useMemo(() => {
    return dataOrder?.results?.filter(
      (item) => selectedItems?.includes(+item.id) && item?.status !== 'Invoiced'
    );
  }, [dataOrder?.results, selectedItems]);

  const itemsNotShipped = useMemo(() => {
    return dataOrder?.results?.filter(
      (item) => selectedItems?.includes(+item.id) && item?.status !== 'Shipped'
    );
  }, [dataOrder?.results, selectedItems]);

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
    dispatch(actions.getOrderRequest());
    const dataOrder = await services.getOrderService({
      search: '',
      page,
      status: '',
      retailer: ''
    });
    dispatch(actions.getOrderSuccess(dataOrder));
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
        status: status || '',
        retailer: retailer || ''
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
  }, [dispatch, debouncedSearchTerm, page, status, retailer, dispatchAlert]);

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
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage
      });
      dispatchRetailer(actionsRetailer.getRetailerSuccess(res));
    } catch (error: any) {
      dispatchRetailer(actionsRetailer.getRetailerFailure(error));
    }
  }, [dispatchRetailer, debouncedSearchTerm, page, rowsPerPage]);

  const totalNewOrder = useMemo(() => {
    return countNewOrder.retailers?.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue.count,
      0
    );
  }, [countNewOrder.retailers]);

  const handleAcknowledge = async () => {
    const dataAcknowledge = itemsNotShipped?.filter((item) => selectedItems?.includes(+item?.id));
    try {
      dispatch(actions.createAcknowledgeBulkRequest());
      const res = await services.createAcknowledgeBulkService(
        dataAcknowledge?.map((item) => +item.id)
      );
      dispatch(actions.createAcknowledgeBulkSuccess());
      setResBulkAcknowledge(res);
      handleGetOrder();
    } catch (error: any) {
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

  const handleBulkVerify = async () => {
    try {
      dispatch(actions.verifyBulkRequest());
      const res = await services.verifyAddBulkService(dataOrder?.results?.map((item) => +item.id));
      dispatch(actions.verifyBulkSuccess());
      setBulkVerify(res);
      handleGetOrder();
    } catch (error: any) {
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
      router.push(
        `/orders?status=${filter?.status?.value || ''}&retailer=${filter?.retailer?.label || ''}`
      );
      dispatch(actions.getOrderRequest());
      const dataOrder = await services.getOrderService({
        search: debouncedSearchTerm,
        page,
        status: filter?.status?.value || '',
        retailer: filter?.retailer?.label || ''
      });
      dispatch(actions.getOrderSuccess(dataOrder));
    } catch (error) {
      dispatch(actions.getOrderFailure(error));
    }
  };

  const handleShip = async () => {
    const dataShip = itemsNotInvoiced?.filter((item) => selectedItems?.includes(+item?.id));
    const body = dataShip?.map((item: Order) => ({
      id: item.id,
      carrier: item.carrier?.id,
      shipping_service: item.shipping_service,
      shipping_ref_1: item.shipping_ref_1,
      shipping_ref_2: item.shipping_ref_2,
      shipping_ref_3: item.shipping_ref_3,
      shipping_ref_4: item.shipping_ref_4,
      shipping_ref_5: item.shipping_ref_5
    })) as never;
    try {
      dispatch(actions.shipBulkRequest());
      const res = await services.shipBulkService(body);
      dispatch(actions.shipBulkSuccess());
      setResBulkShip(res);
      handleGetOrder();
    } catch (error: any) {
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
  };

  const handleCloseBulkAcknowledge = () => {
    setResBulkAcknowledge([]);
  };

  const handleCloseBulkVerify = () => {
    setBulkVerify([]);
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
                handleChangeText={handleSearch}
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
                handleChangeText={handleSearch}
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
          />
        </div>
      </div>
      {resBulkShip.length > 0 && (
        <ResultBulkShip
          isLoadingShipment={isLoadingShipment}
          resBulkShip={resBulkShip}
          handleCloseBulkShip={handleCloseBulkShip}
        />
      )}
      {resBulkAcknowledge.length > 0 && (
        <ResultBulkAcknowledge
          resBulkAcknowledge={resBulkAcknowledge}
          handleCloseBulkAcknowledge={handleCloseBulkAcknowledge}
        />
      )}
      {resBulkVerify.length > 0 && (
        <ResultBulkVerify
          isLoadingVerifyBulk={isLoadingVerifyBulk}
          resBulkVerify={resBulkVerify}
          handleCloseBulkVerify={handleCloseBulkVerify}
        />
      )}
    </main>
  );
}
