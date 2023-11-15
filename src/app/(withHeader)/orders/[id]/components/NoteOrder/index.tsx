import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
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

import type { NoteOrder, Order } from '@/app/(withHeader)/orders/interface';
import { headerTableNote, schemaNote } from '@/app/(withHeader)/orders/constants';
import { truncateText } from '@/utils/utils';

const NoteOrder = ({ orderDetail }: { orderDetail: Order }) => {
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const defaultValues = {
    detail: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver<any>(schemaNote)
  });

  const renderBodyTable = orderDetail?.notes?.map((row) => ({
    id: row?.id || '',
    time_created: <p className="w-fit">{dayjs(row.created_at).format('MM/DD/YYYY') || ''}</p>,
    from: (
      <p className="w-fit">
        {row?.user?.first_name} {row?.user?.last_name}
      </p>
    ),
    details: (
      <div className="h-fit max-w-[450px] items-start whitespace-normal break-words">
        {row?.details ? (
          <>
            {(!expanded && <p>{truncateText(row?.details, 170)}</p>) || row?.details}
            {row?.details?.length > 170 && (
              <p onClick={toggleExpanded} className="text-dodgeBlue">
                {' '}
                {!expanded ? 'Show more' : 'Show less'}
              </p>
            )}
          </>
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
          className="w-[100px] dark:bg-gunmetal"
        >
          <div className="z-50 rounded-lg">
            <Button onClick={() => handleEditRow(row)}>
              <PenIcon />
              <span className="text-lightPrimary dark:text-santaGrey">Edit</span>
            </Button>
            <Button onClick={() => handleDeleteItem(+row.id)}>
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
    } catch (error) {}
  };

  const handleEditRow = async (item: NoteOrder) => {};

  const handleCancelAddNew = () => {
    setIsAddNew(false);
    reset();
  };

  const handleCreateNote = async () => {
    try {
    } catch (error) {}
  };

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
        <form noValidate onSubmit={handleSubmit(handleCreateNote)}>
          <Controller
            control={control}
            name="detail"
            render={({ field }) => (
              <TextArea
                {...field}
                rows={3}
                required
                label="Detail"
                name="detail"
                placeholder="Enter detail"
                error={errors.detail?.message}
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
            <Button className="bg-primary500 text-white">Create Note</Button>
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
