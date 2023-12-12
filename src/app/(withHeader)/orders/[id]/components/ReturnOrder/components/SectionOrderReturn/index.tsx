import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  REASON_RETURN_ORDER,
  headerTableNote,
  headerTableOrderReturn,
  schemaNote
} from '@/app/(withHeader)/orders/constants';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import { TextArea } from '@/components/ui/TextArea';

import IconAction from 'public/three-dots.svg';
import IconDelete from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';
import IconPlus from 'public/plus-icon.svg';
import { convertFormatDateTime, truncateText } from '@/utils/utils';
import Autocomplete from '@/components/ui/Autocomplete';
import { Options } from '@/app/(withHeader)/orders/containers';

import type { OrderReturn, OrderReturnNote } from '@/app/(withHeader)/orders/interface';
import { Input } from '@/components/ui/Input';
import Icons from '@/components/Icons';

type SectionOrderReturn = {
  listOrderReturn: OrderReturn[]
};

export default function SectionOrderReturn(props: SectionOrderReturn) {
  const { listOrderReturn } = props;
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [idNote, setIdNote] = useState<number | null>(null);
  const [itemsOrderReturn, setItemsOrderReturn] = useState<OrderReturn[]>([]);

  const handleChangeReason = (selectedItemId: number, itemSelect: Options) => {
    const listItem = itemsOrderReturn?.map((item) => {
      return {
        ...item,
        reason: item?.id === selectedItemId ? itemSelect?.label : item?.reason
      };
    });
    setItemsOrderReturn(listItem);
  };

  const detailNoteReturn = [] as OrderReturnNote[];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    itemData: OrderReturn
  ) => {
    if (+e.target.value >= 0) {
      const newData = itemsOrderReturn?.map((item: OrderReturn) =>
        item.id === itemData.id
          ? {
              ...item,
              [name]: +e.target.value
            }
          : item
      );

      setItemsOrderReturn(newData);
    }
  };

  const renderBodyTableOrderReturn = itemsOrderReturn?.map((row: OrderReturn) => ({
    id: row?.id || '',
    merchant_sku: row?.product_alias?.merchant_sku || '-',
    product_alias: row?.product_alias?.product_name ? (
      <p
        className="text-dodgeBlue underline"
        onClick={() => window.open(`/product-aliases/${row?.product_alias?.id}`, '_blank')}
      >
        {row.product_alias.product_name}
      </p>
    ) : (
      '-'
    ),
    return_qty: (
      <div className="max-w-[100px]">
        <Input
          type="number"
          value={row?.return_qty}
          min={0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'return_qty', row)}
        />
      </div>
    ),
    unbroken_qty: (
      <div className="max-w-[100px]">
        <Input
          type="number"
          value={row?.unbroken_qty}
          min={0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(e, 'unbroken_qty', row)
          }
        />
      </div>
    ),
    reason: (
      <Autocomplete
        options={REASON_RETURN_ORDER}
        name="reason"
        placeholder="Select reason"
        value={row?.reason}
        addNew={false}
        onReload={() => {}}
        onChange={(itemSelect: Options) => handleChangeReason(row?.id, itemSelect)}
        classNameUl="min-w-[260px]"
        isClassNameContainer={false}
      />
    )
  }));

  const renderBodyTableNoteReturn = detailNoteReturn?.map((row: OrderReturnNote) => ({
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

  const handleDeleteItem = async (id: number) => {};

  const handleEditRow = async (item: OrderReturnNote) => {
    setIdNote(item?.id);
    setIsAddNew(true);
  };

  const handleCancelAddNew = () => {
    setIsAddNew(false);
    setIdNote(null);
    reset();
  };

  const handleSubmitNote = async (data: { details: string }) => {};

  useEffect(() => {
    if (listOrderReturn) {
      const listItem = listOrderReturn?.map((item: OrderReturn) => {
        return {
          ...item,
          reason: item?.reason ? item?.reason : REASON_RETURN_ORDER[0]?.label
        };
      });
      setItemsOrderReturn(listItem);
    }
  }, [listOrderReturn]);

  return (
    <CardToggle
      iconTitle={<Icons glyph="product" />}
      title="Order Return"
      className="grid w-full grid-cols-1 gap-2"
    >
      <div className="mb-4">
        <Table
          columns={headerTableOrderReturn}
          loading={false}
          rows={renderBodyTableOrderReturn}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
          isHoverRow={false}
        />
      </div>

      {!isAddNew && (
        <div className="mb-4 flex w-full items-center justify-between">
          <span>Return Note</span>
          <Button
            onClick={() => setIsAddNew(true)}
            className="bg-primary500 text-white"
            startIcon={<IconPlus />}
          >
            Add note
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
            {idNote ? (
              <Button className="bg-primary500 text-white">Update Note</Button>
            ) : (
              <Button className="bg-primary500 text-white">Save Note</Button>
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
    </CardToggle>
  );
}
