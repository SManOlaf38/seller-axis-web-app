import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';

import Icons from '@/components/Icons';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import * as actions from '@/app/(withHeader)/shipments/context/action';
import * as services from '@/app/(withHeader)/shipments/fetch';
import { useStoreShipments } from '@/app/(withHeader)/shipments/context/hooks';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';
import { Order } from '@/app/(withHeader)/orders/interface';
import { Status } from '@/components/ui/Status';
import { ORDER_STATUS } from '@/constants';

export default function ModalCreateReturn({
  openModal,
  handleToggleModal
}: {
  openModal: boolean;
  handleToggleModal: () => void;
}) {
  const ulRef = useRef<HTMLUListElement>(null);
  const {
    debouncedSearchTerm: debouncedSearchTermPo,
    handleSearch: handleSearchPo,
    search
  } = useSearch('PO');
  const { page: pagePO, onPageChange: onPageChangeRetailer } = usePagination();
  const {
    state: { listOrder, isLoadMoreListOrder, isLoadingListOrder },
    dispatch
  } = useStoreShipments();

  const isClickable = useMemo(() => {
    return (status: string) =>
      [
        ORDER_STATUS['Shipment Confirmed'],
        ORDER_STATUS.Invoiced,
        ORDER_STATUS['Invoice Confirmed'],
        ORDER_STATUS['Partly Shipped Confirmed']
      ].includes(status);
  }, []);

  const handleGetOrder = useCallback(async () => {
    try {
      dispatch(actions.getListOrderRequest());
      const dataOrder = await services.getListOrderService({
        search: debouncedSearchTermPo,
        page: 0,
        rowsPerPage: 10
      });
      dispatch(actions.getListOrderSuccess(dataOrder));
    } catch (error: any) {
      dispatch(actions.getListOrderFailure());
    }
  }, [debouncedSearchTermPo, dispatch]);

  const handleViewMorePO = async () => {
    const currentPage = pagePO + 1;
    try {
      dispatch(actions.getLoadMoreListOrderRequest());
      const res = await services.getListOrderService({
        search: debouncedSearchTermPo || '',
        page: currentPage,
        rowsPerPage: 10
      });
      dispatch(actions.getLoadMoreListOrderSuccess(res));
      onPageChangeRetailer(currentPage + 1);
    } catch (error: any) {
      dispatch(actions.getLoadMoreListOrderFailure());
    }
  };

  const onScroll = () => {
    if (ulRef.current && !isLoadMoreListOrder) {
      const { scrollTop, scrollHeight, clientHeight } = ulRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (isNearBottom) {
        handleViewMorePO();
      }
    }
  };

  const onChangePageDetailPO = (option: Order) => {
    if (isClickable(option?.status)) {
      window.open(`/orders/${option?.id}`, '_blank');
      window.localStorage.setItem('return_order_id', option?.id as string);
    }
  };

  useEffect(() => {
    debouncedSearchTermPo && handleGetOrder();
  }, [debouncedSearchTermPo, handleGetOrder]);

  useEffect(() => {
    const listInnerElement = ulRef.current;
    if (listInnerElement && listOrder?.next) {
      listInnerElement.addEventListener('scroll', onScroll);
      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ulRef.current, listOrder?.next, isLoadMoreListOrder]);

  return (
    <Modal open={openModal} onClose={handleToggleModal}>
      <div className="relative w-full">
        <Input
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSearchPo(e);
          }}
          placeholder="Search PO Number"
          className="border-none py-2 pl-[50px] pr-3"
          startIcon={<Icons glyph="search" />}
        />
        {search && (
          <>
            {isLoadingListOrder ? (
              <div className="absolute z-10 max-h-[250px] w-full select-none overflow-y-auto rounded-lg bg-paperLight shadow-lg dark:bg-darkGreen">
                {Array(2)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-center justify-between px-4">
                      <div className="my-2 h-[38px] w-[153px] bg-grey500 dark:bg-gray-500 " />
                      <div className="h-[24px] w-[74px] rounded-md bg-grey500 dark:bg-gray-500" />
                    </div>
                  ))}
              </div>
            ) : (
              <ul
                ref={ulRef}
                className="absolute z-10 max-h-[250px] w-full select-none overflow-y-auto rounded-lg bg-paperLight shadow-lg dark:bg-darkGreen"
              >
                {listOrder?.results?.length > 0 ? (
                  <>
                    {listOrder?.results.map((option: Order) => {
                      return (
                        <li
                          className={`${
                            isClickable(option?.status)
                              ? 'cursor-pointer hover:bg-neutralLight hover:dark:bg-gunmetal'
                              : 'cursor-not-allowed'
                          } flex items-center justify-between px-4 py-2`}
                          key={option?.id}
                          onClick={() => onChangePageDetailPO(option)}
                        >
                          {option.po_number}
                          <Status name={option?.status} />
                        </li>
                      );
                    })}
                    {isLoadMoreListOrder && (
                      <li>
                        {Array(2)
                          .fill(0)
                          .map((_, index) => (
                            <div key={index} className="flex items-center justify-between px-4">
                              <div className="my-2 h-[38px] w-[153px] bg-grey500 dark:bg-gray-500 " />
                              <div className="h-[24px] w-[74px] rounded-md bg-grey500 dark:bg-gray-500" />
                            </div>
                          ))}
                      </li>
                    )}
                  </>
                ) : (
                  <li className="px-4 py-2 text-gray-500">No results</li>
                )}
              </ul>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
