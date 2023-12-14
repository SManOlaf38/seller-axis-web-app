import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import dayjs from 'dayjs';

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
import { Input } from '@/components/ui/Input';
import Icons from '@/components/Icons';
import { Radius } from '@/components/ui/Radius';
import Tooltip from '@/components/ui/Tooltip';

import IconAction from 'public/three-dots.svg';
import IconDelete from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';
import IconPlus from 'public/plus-icon.svg';
import { convertFormatDateTime, truncateText } from '@/utils/utils';
import Autocomplete from '@/components/ui/Autocomplete';
import { Options } from '@/app/(withHeader)/orders/containers';

import type {
  ItemOrder,
  OrderItemReturn,
  OrderReturnNote
} from '@/app/(withHeader)/orders/interface';
import { minDate } from '@/constants';

type SectionOrderReturn = {
  items: ItemOrder[];
};

export default function SectionOrderReturn(props: SectionOrderReturn) {
  const { items } = props;
  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [idNote, setIdNote] = useState<number | null>(null);
  const [itemsOrderReturn, setItemsOrderReturn] = useState<OrderItemReturn[]>([]);
  const [listReturnNote, setListReturnNote] = useState<OrderReturnNote[]>([]);
  const [isDispute, setIsDispute] = useState<boolean>(false);
  const [dateDispute, setDateDispute] = useState(dayjs(new Date()).format('YYYY-MM-DD'));

  const handleChangeReason = (selectedItemId: number, itemSelect: Options) => {
    const listItem = itemsOrderReturn?.map((item) => {
      return {
        ...item,
        reason: item?.id === selectedItemId ? itemSelect?.label : item?.reason
      };
    });
    setItemsOrderReturn(listItem);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      details: ''
    },
    resolver: yupResolver<any>(schemaNote)
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    itemData: OrderItemReturn
  ) => {
    if (+e.target.value < 0 || +e.target.value > itemData?.qty_ordered) {
      return;
    }

    const newData = itemsOrderReturn?.map((item: OrderItemReturn) =>
      item.id === itemData.id
        ? {
            ...item,
            [name]:
              name === 'damaged' && +e.target.value < itemData?.return_qty
                ? +e.target.value
                : name === 'return_qty' && +e.target.value
          }
        : item
    );

    setItemsOrderReturn(newData);
  };

  const renderBodyTableOrderReturn = itemsOrderReturn?.map((row: OrderItemReturn) => {
    const itemOrder = items?.find((item) => item?.id === row?.id);

    return {
      id: row?.id || '',
      merchant_sku: row?.merchant_sku || '-',
      product_alias: row?.product_alias?.sku ? (
        <span
          className="text-dodgeBlue underline"
          onClick={() => window.open(`/product-aliases/${row?.product_alias?.id}`, '_blank')}
        >
          {row?.product_alias?.sku}
        </span>
      ) : (
        '-'
      ),
      return_qty: (
        <div className="max-w-[100px]">
          <Input
            type="number"
            value={row?.return_qty}
            max={itemOrder?.qty_ordered}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, 'return_qty', row)
            }
          />
        </div>
      ),
      damaged: (
        <div className="max-w-[100px]">
          <Input
            type="number"
            value={row?.damaged}
            max={itemOrder ? itemOrder?.qty_ordered - row?.return_qty : row?.return_qty}
            min={0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, 'damaged', row)}
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
          onChange={(itemSelect: Options) => handleChangeReason(+row?.id, itemSelect)}
          classNameUl="min-w-[260px]"
          isClassNameContainer={false}
        />
      )
    };
  });

  const renderBodyTableNoteReturn = listReturnNote?.map((row: OrderReturnNote) => ({
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
    if (items) {
      const listItem = items?.map((item: ItemOrder) => {
        return {
          id: item?.id,
          merchant_sku: item?.merchant_sku,
          reason: REASON_RETURN_ORDER[0]?.label,
          return_qty: item?.qty_ordered,
          qty_ordered: item?.qty_ordered,
          product_alias: item?.product_alias,
          damaged: 0
        };
      });
      setItemsOrderReturn(listItem as OrderItemReturn[]);
    }
  }, [items]);

  return (
    <CardToggle
      iconTitle={<Icons glyph="product" />}
      title="Order Return"
      className="grid w-full grid-cols-1 gap-2"
    >
      <div className="mb-4">
        <div className="flex items-center">
          <Radius onChange={() => setIsDispute(!isDispute)} />
          <div className="ml-2 flex items-center">
            <span className="mr-1">Dispute</span>
            <Tooltip content="Is this order disputing?">
              <Image src="/question-icon.svg" width={16} height={16} alt="question" />
            </Tooltip>
          </div>
        </div>
        {isDispute && (
          <div className="mt-3 max-w-[200px]">
            <Input
              value={dateDispute}
              placeholder="Enter dispute date"
              label="Dispute date"
              min={minDate()}
              type="date"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDateDispute(e.target.value);
              }}
            />
          </div>
        )}

        <div className="mt-4">
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
