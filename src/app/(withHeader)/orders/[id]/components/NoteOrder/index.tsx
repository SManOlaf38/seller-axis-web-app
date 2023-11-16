import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import IconAction from 'public/three-dots.svg';
import IconDelete from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';
import IconPlus from 'public/plus-icon.svg';
import { TextArea } from '@/components/ui/TextArea';
import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { headerTableNote, schemaNote } from '@/app/(withHeader)/orders/constants';
import { convertFormatDateTime, truncateText } from '@/utils/utils';
import {
  createNoteService,
  deleteNoteService,
  getOrderDetailServer,
  updateNoteService
} from '@/app/(withHeader)/orders/fetch';

import type { NoteOrder, Order } from '@/app/(withHeader)/orders/interface';

const NoteOrder = ({ orderDetail }: { orderDetail: Order }) => {
  const {
    state: { isLoadingCreateNote, isLoadingUpdateNote, isLoadingDeleteNote },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [idNote, setIdNote] = useState<number | null>(null);

  const itemDetailRowNote = useMemo(() => {
    return orderDetail?.notes?.find((item) => item?.id === idNote) || null;
  }, [idNote, orderDetail?.notes]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

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

  const renderBodyTable = orderDetail?.notes?.map((row) => ({
    id: row?.id || '',
    time_created: <p className="w-fit">{convertFormatDateTime(row?.created_at)}</p>,
    from: (
      <p className="w-fit">
        {row?.user?.first_name} {row?.user?.last_name}
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
            <Button
              onClick={() => handleEditRow(row)}
              isLoading={isLoadingUpdateNote}
              disabled={isLoadingUpdateNote}
            >
              <PenIcon />
              <span className="text-lightPrimary dark:text-santaGrey">Edit</span>
            </Button>
            <Button
              onClick={() => handleDeleteItem(+row.id)}
              isLoading={isLoadingDeleteNote}
              disabled={isLoadingDeleteNote}
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
      dispatch(actions.deleteNoteRequest());
      await deleteNoteService(id);
      dispatch(actions.deleteNoteSuccess());
      setExpanded(true);
      const dataOrder = await getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Note Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.deleteNoteFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Note Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleEditRow = async (item: NoteOrder) => {
    setIdNote(item?.id);
    setIsAddNew(true);
  };

  const handleCancelAddNew = () => {
    setIsAddNew(false);
    setIdNote(null);
    reset();
  };

  const handleSubmitNote = async (data: { details: string }) => {
    try {
      if (idNote) {
        dispatch(actions.updateNoteRequest());
        await updateNoteService(
          {
            order: +orderDetail?.id,
            details: data?.details
          },
          idNote
        );
        dispatch(actions.updateNoteSuccess());
        setExpanded(true);
        dispatchAlert(
          openAlertMessage({
            message: 'Update Note Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      } else {
        dispatch(actions.createNoteRequest());
        await createNoteService({
          order: +orderDetail?.id,
          details: data?.details
        });
        dispatch(actions.createNoteSuccess());
        dispatchAlert(
          openAlertMessage({
            message: 'Create Note Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      }
      handleCancelAddNew();
      const dataOrder = await getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      if (idNote) {
        dispatch(actions.updateNoteFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Update Note Fail',
            color: 'error',
            title: 'Fail'
          })
        );
      } else {
        dispatch(actions.createNoteFailure());
        dispatchAlert(
          openAlertMessage({
            message: error?.message || 'Create Note Fail',
            color: 'error',
            title: 'Fail'
          })
        );
      }
    }
  };

  useEffect(() => {
    if (idNote && itemDetailRowNote) {
      setValue('details', itemDetailRowNote?.details);
    }
  }, [idNote, itemDetailRowNote, setValue]);

  return (
    <CardToggle title="Internal Notes" className="grid w-full grid-cols-1 gap-2">
      {!isAddNew && (
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => setIsAddNew(true)}
            className="bg-primary500 text-white"
            startIcon={<IconPlus />}
          >
            Add new note
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
              disabled={isLoadingCreateNote || isLoadingUpdateNote}
              className="mr-4 bg-gey100 dark:bg-gunmetal"
            >
              Cancel
            </Button>
            {idNote ? (
              <Button
                isLoading={isLoadingUpdateNote}
                disabled={isLoadingUpdateNote}
                className="bg-primary500 text-white"
              >
                Update Note
              </Button>
            ) : (
              <Button
                isLoading={isLoadingCreateNote}
                disabled={isLoadingCreateNote}
                className="bg-primary500 text-white"
              >
                Create Note
              </Button>
            )}
          </div>
        </form>
      )}

      <Table
        columns={headerTableNote}
        loading={false}
        rows={renderBodyTable || []}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        currentPage={10}
        pageSize={10}
        isBorder={false}
      />
    </CardToggle>
  );
};

export default NoteOrder;
