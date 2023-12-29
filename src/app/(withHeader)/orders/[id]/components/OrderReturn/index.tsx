import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { TextArea } from '@/components/ui/TextArea';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  STATUS_RETURN,
  headerTableNote,
  headerTableSectionOrderReturn,
  schemaNote
} from '@/app/(withHeader)/orders/constants';
import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import Icons from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import IconDelete from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';
import IconAction from 'public/three-dots.svg';
import { truncateText } from '@/utils/utils';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import IconPlus from 'public/plus-icon.svg';
import {
  addReturnNoteService,
  deleteReturnNoteService,
  deleteReturnService,
  getOrderDetailServer,
  receivedReturnService,
  updateReturnNoteService
} from '../../../fetch';

import type {
  Notes,
  OrderReturnsItems,
  TypeOrderReturn
} from '@/app/(withHeader)/orders/interface';
import SectionDispute from '../SectionDispute';
import SectionDisputeResult from '../SectionDisputeResult';
import { Status } from '@/components/ui/Status';
import useToggleModal from '@/hooks/useToggleModal';
import ModalConfirmDeleteReturn from '../ModalConfirmDeleteReturn';

type OrderReturn = {
  orderReturn: TypeOrderReturn;
};

export default function OrderReturn(props: OrderReturn) {
  const { orderReturn } = props;
  const {
    state: {
      isUpdateReturnOrder,
      isDeleteReturnOrder,
      isAddReturnOrder,
      isLoadingReturnOrder,
      orderDetail,
      isLoadingReceived
    },
    dispatch
  } = useStore();
  const { openModal, handleToggleModal } = useToggleModal();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [itemEditNote, setItemEditNote] = useState<Notes | null>(null);
  const [isDispute, setIsDispute] = useState<boolean>(false);
  const [isResultDispute, setIsResultDispute] = useState<boolean>(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    defaultValues: {
      details: ''
    },
    resolver: yupResolver<any>(schemaNote)
  });

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const onDeleteReturnOrder = async () => {
    try {
      dispatch(actions.deleteReturnRequest());
      await deleteReturnService(orderReturn?.id);
      dispatch(actions.deleteReturnSuccess());
      handleToggleModal();
      setIsResultDispute(false);
      setIsDispute(false);
      const dataOrder = await getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete return order successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.deleteReturnFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete return order fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const renderBodyTableOrderReturn = orderReturn?.order_returns_items?.map(
    (row: OrderReturnsItems) => {
      return {
        id: row?.id || '',
        merchant_sku: row?.item?.merchant_sku || '-',
        product_alias: row?.item?.product_alias?.sku ? (
          <span
            className="text-dodgeBlue underline"
            onClick={() =>
              window.open(`/product-aliases/${row?.item?.product_alias?.id}`, '_blank')
            }
          >
            {row?.item?.product_alias?.sku}
          </span>
        ) : (
          '-'
        ),
        return_qty: row?.return_qty || 0,
        damaged: row?.damaged_qty || 0,
        reason: row?.reason || '-'
      };
    }
  );

  const renderBodyTableNoteReturn = orderReturn?.notes?.map((row: Notes) => ({
    id: row?.id,
    time_created: row?.created_at ? dayjs(row.created_at).format('MM/DD/YYYY') : '-',
    from: (
      <p className="w-fit">
        {row?.user?.first_name || '-'} {row?.user?.last_name || '-'}
      </p>
    ),
    details: (
      <div className="h-fit max-w-[580px] items-start whitespace-normal break-words">
        {row?.details ? (
          <p>
            {(!expanded && <span>{truncateText(row?.details, 210)}</span>) || row?.details}
            {row?.details?.length > 210 && (
              <span onClick={toggleExpanded} className="text-dodgeBlue">
                {' '}
                {!expanded ? 'Show more' : 'Show less'}
              </span>
            )}
          </p>
        ) : (
          '-'
        )}
      </div>
    ),
    action: (
      <div
        className="flex items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <Dropdown
          classButton="justify-center"
          mainMenu={<IconAction />}
          className="bottom-0 right-3 w-[100px] dark:bg-gunmetal"
        >
          <div className="z-50 rounded-lg">
            <Button onClick={() => handleEditRow(row)}>
              <PenIcon />
              <span className="text-lightPrimary dark:text-santaGrey">Edit</span>
            </Button>
            <Button
              isLoading={isDeleteReturnOrder}
              disabled={isDeleteReturnOrder}
              onClick={() => handleDeleteItem(row?.id)}
            >
              <IconDelete />
              <span className="text-lightPrimary dark:text-santaGrey">Delete</span>
            </Button>
          </div>
        </Dropdown>
      </div>
    )
  }));

  const handleDeleteItem = async (id: number) => {
    try {
      dispatch(actions.deleteReturnNoteRequest());
      await deleteReturnNoteService(id);
      dispatch(actions.deleteReturnNoteSuccess(id));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete return note successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.deleteReturnNoteFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete return note fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleEditRow = async (item: Notes) => {
    setValue('details', item?.details);
    setItemEditNote(item);
    setIsAddNew(true);
  };

  const handleCancelAddNew = () => {
    setIsAddNew(false);
    setItemEditNote(null);
    reset();
  };

  const handleSubmitNote = async (data: { details: string }) => {
    const body = {
      details: data.details,
      order_return: orderReturn?.id
    };
    if (itemEditNote) {
      try {
        dispatch(actions.updateReturnNoteRequest());
        const res = await updateReturnNoteService(body, itemEditNote?.id);
        dispatch(actions.updateReturnNoteSuccess(res));
        dispatchAlert(
          openAlertMessage({
            message: 'Update return note successfully',
            color: 'success',
            title: 'Success'
          })
        );
      } catch (error: any) {
        dispatch(actions.updateReturnNoteFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Update return note fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    } else {
      try {
        dispatch(actions.addReturnNoteRequest());
        const res = await addReturnNoteService(body);
        dispatch(actions.addReturnNoteSuccess(res));
        dispatchAlert(
          openAlertMessage({
            message: 'Add return note successfully',
            color: 'success',
            title: 'Success'
          })
        );
      } catch (error: any) {
        dispatch(actions.addReturnNoteFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Add return note fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    }

    handleCancelAddNew();
  };

  const onDispute = () => {
    setIsDispute(true);
  };

  const onEditReturn = () => {};

  const onReceivedItemReturn = async () => {
    const body = {
      status: STATUS_RETURN.return_receive
    };
    try {
      dispatch(actions.receivedReturnRequest());
      const res = await receivedReturnService(body, orderReturn?.id);
      dispatch(actions.receivedReturnSuccess(res));
      dispatchAlert(
        openAlertMessage({
          message: 'Received return item successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.receivedReturnFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Received return item fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    orderReturn?.is_dispute ? setIsDispute(true) : setIsDispute(false);
  }, [orderReturn?.is_dispute]);

  useEffect(() => {
    setIsResultDispute(!!orderReturn?.dispute_reason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderReturn?.dispute_reason)]);

  return (
    <>
      <CardToggle
        iconTitle={<Icons glyph="product" />}
        title={
          <div className="flex items-center">
            <p className="mr-3">Order Return</p>
            <Status name={orderReturn?.status} />
          </div>
        }
        className="grid w-full grid-cols-1 gap-2"
      >
        <div className="mb-4">
          <Table
            columns={headerTableSectionOrderReturn}
            loading={false}
            rows={renderBodyTableOrderReturn}
            totalCount={0}
            siblingCount={1}
            onPageChange={() => {}}
            currentPage={10}
            pageSize={10}
          />
        </div>

        {!isAddNew && (
          <div className="mb-4 flex w-full items-center justify-between">
            <span>
              Return Note {orderReturn?.notes?.length ? `(${orderReturn?.notes?.length})` : ''}
            </span>
            <Button
              onClick={() => setIsAddNew(true)}
              className="bg-primary500 text-white"
              startIcon={<IconPlus />}
            >
              Add note order return
            </Button>
          </div>
        )}

        {isAddNew && (
          <form noValidate onSubmit={handleSubmit(handleSubmitNote)}>
            <Controller
              control={control}
              name="details"
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  required
                  label="Detail"
                  name="details"
                  placeholder="Enter detail"
                  error={errors.details?.message}
                />
              )}
            />
            <div className="flex justify-end py-4">
              <Button
                type="button"
                onClick={handleCancelAddNew}
                className="mr-4 bg-gey100 dark:bg-gunmetal"
              >
                Cancel
              </Button>
              {itemEditNote ? (
                <Button
                  isLoading={isUpdateReturnOrder}
                  disabled={isUpdateReturnOrder}
                  className="bg-primary500 text-white"
                >
                  Update Note
                </Button>
              ) : (
                <Button
                  isLoading={isAddReturnOrder}
                  disabled={isAddReturnOrder}
                  className="bg-primary500 text-white"
                >
                  Add Note
                </Button>
              )}
            </div>
          </form>
        )}

        <Table
          columns={headerTableNote}
          loading={false}
          rows={renderBodyTableNoteReturn || []}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
          isBorder={false}
        />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              disabled={isLoadingReturnOrder || isLoadingReceived}
              type="button"
              onClick={handleToggleModal}
              className="mr-3 cursor-pointer text-xs text-redLight"
            >
              Delete requested return order
            </button>
            <Button
              onClick={onDispute}
              className="bg-primary500 text-white"
              disabled={isDispute || Boolean(orderReturn?.dispute_reason)}
            >
              Dispute
            </Button>
          </div>
          <div className="flex items-center">
            <Button
              disabled={Boolean(orderReturn?.status)}
              onClick={onEditReturn}
              className="mr-3 bg-primary500 text-white"
            >
              Edit
            </Button>
            <Button
              disabled={isLoadingReceived || Boolean(orderReturn?.status)}
              isLoading={isLoadingReceived}
              type="button"
              onClick={onReceivedItemReturn}
              className="bg-primary500 text-white"
            >
              Received return item
            </Button>
          </div>
        </div>
      </CardToggle>
      {isDispute && (
        <SectionDispute
          orderReturn={orderReturn}
          setIsDispute={setIsDispute}
          isResultDispute={isResultDispute}
          isDispute={isDispute}
          setIsResultDispute={setIsResultDispute}
        />
      )}
      {isResultDispute && (
        <SectionDisputeResult
          setIsResultDispute={setIsResultDispute}
          setIsDispute={setIsDispute}
          orderReturn={orderReturn}
        />
      )}
      <ModalConfirmDeleteReturn
        openModal={openModal}
        handleToggleModal={handleToggleModal}
        onDeleteReturnOrder={onDeleteReturnOrder}
        isLoadingReturnOrder={isLoadingReturnOrder}
      />
    </>
  );
}
