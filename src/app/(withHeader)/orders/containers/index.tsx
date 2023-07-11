'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { SubBar } from '@/components/common/SubBar';
import Autocomplete from '@/components/ui/Autocomplete';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import { TableOrder } from '../components/TableOrder';
import { headerTable } from '../constants';
import { useStore } from '../context';
import * as actions from '../context/action';
import * as services from '../fetch';
import { Button } from '@/components/ui/Button';

const filterStatus = [
  {
    label: 'Shipping',
    value: 'shipping'
  },
  {
    label: 'Shipped',
    value: 'shipped'
  },
  {
    label: 'Confirmed',
    value: 'confirmed'
  },
  {
    label: 'Received',
    value: 'received'
  }
];

type Options = { label: string; value: string };

export default function OrderContainer() {
  const {
    state: { isLoading, dataOrder },
    dispatch
  } = useStore();
  const router = useRouter();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataOrder?.results
  });

  const [filter, setFilter] = useState<{
    status: Options | object;
    retailer: Options | object;
  }>({
    status: {},
    retailer: {}
  });

  const handleChangeFilter = (name: string, value: Options) => {
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleViewDetailItem = (id: number) => {
    router.push(`/orders/${id}`);
  };

  const handleGetOrder = useCallback(async () => {
    try {
      dispatch(actions.getOrderRequest());
      const dataOrder = await services.getOrderService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getOrderSuccess(dataOrder));
    } catch (error) {
      dispatch(actions.getOrderFailure(error));
    }
  }, [dispatch, page, debouncedSearchTerm]);

  useEffect(() => {
    handleGetOrder();
  }, [handleGetOrder]);

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
                value={filter}
                onChange={(value: Options) => handleChangeFilter('status', value)}
              />
              <Autocomplete
                options={[
                  {
                    label: 'Amazon',
                    value: 1
                  },
                  {
                    label: 'Walmart',
                    value: 2
                  },
                  {
                    label: 'CommerceHub',
                    value: 3
                  }
                ]}
                handleChangeText={handleSearch}
                addNew={false}
                label="Retailer"
                name="retailer"
                placeholder="Select Retailer"
                value={filter}
                onChange={(value: Options) => handleChangeFilter('retailer', value)}
              />

              <div className='grid w-full grid-cols-2 gap-2 '>
                <Button className='flex justify-center'>Clear</Button>
                <Button className='bg-dodgerBlue flex justify-center'>Apply</Button>
              </div>
            </div>
          }
        />

        <div className="h-full">
          <TableOrder
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
          />
        </div>
      </div>
    </main>
  );
}
