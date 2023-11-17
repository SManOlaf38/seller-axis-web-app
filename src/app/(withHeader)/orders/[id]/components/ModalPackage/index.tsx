import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import IconPlus from 'public/plus-icon.svg';
import { useStoreBox } from '@/app/(withHeader)/box/context';
import { useStore } from '@/app/(withHeader)/orders/context';
import { getBoxFailure, getBoxRequest, getBoxSuccess } from '@/app/(withHeader)/box/context/action';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { getBoxService } from '@/app/(withHeader)/box/fetch';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { Input } from '@/components/ui/Input';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';
import { headerTableAddNewBox } from '@/app/(withHeader)/orders/[id]/components/Package/constants';
import TableAddNewBox from '../TableAddNewBox';
import Tooltip from '@/components/ui/Tooltip';
import useToggleModal from '@/hooks/useToggleModal';
import ModalConfirmDeleteBox from '../ModalConfirmDeleteBox';

import type {
  ItemOrderItemPack,
  ItemTableAddBox,
  Order,
  OrderItemPackages,
  OrderPackage,
  RetailerPurchaseOrderItem
} from '@/app/(withHeader)/orders/interface';

export const schema = yup.object().shape({
  box_id: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Box is required'),
  po_item_id: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Order is required'),
  qty: yup
    .number()
    .min(0, 'Quantity must be greater than or equal to 0')
    .typeError('Quantity is required')
});

type InviteMember = {
  open: boolean;
  onModalMenuToggle: () => void;
  orderDetail: Order;
  setItemPackageDeleted: Dispatch<SetStateAction<OrderItemPackages[]>>;
  itemPackageDeleted: OrderItemPackages[];
  orderPackageNotShip: OrderPackage[];
};

export const InviteMember = ({
  open,
  onModalMenuToggle,
  orderDetail,
  itemPackageDeleted,
  setItemPackageDeleted,
  orderPackageNotShip
}: InviteMember) => {
  const params = useParams();
  const {
    state: { dataBox },
    dispatch: boxDispatch
  } = useStoreBox();
  const {
    state: { isLoadingCreatePackageBox, isLoadingCreateBulkPackageBox },
    dispatch
  } = useStore();
  const { openModal, handleToggleModal } = useToggleModal();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const [dataTableEditPack, setDataTablePack] = useState<ItemTableAddBox | null>(null);
  const [isItemEdit, setIsItemEdit] = useState<boolean>(false);

  const filteredArraySame = useMemo(() => {
    return itemPackageDeleted?.filter((item, index, array) => {
      const nameIndex = array?.findIndex(
        (obj) =>
          obj?.retailer_purchase_order_item?.product_alias?.sku ===
          item?.retailer_purchase_order_item?.product_alias?.sku
      );
      return index === nameIndex;
    });
  }, [itemPackageDeleted]);

  const { search, debouncedSearchTerm, handleSearch } = useSearch('box');
  const { page, rowsPerPage, onPageChange } = usePagination();

  const defaultValues = useMemo(() => {
    return {
      box_id: null,
      po_item_id: null,
      qty: 0
    };
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schema)
  });
  const boxId = watch('box_id');
  const poItemId = watch('po_item_id');
  const qty = watch('qty');

  const skuQuantity = useMemo(() => {
    return dataTableEditPack?.order_item_packages?.reduce(
      (acc: number, product: ItemOrderItemPack) => {
        const skuQuantity = product?.sku_quantity || 0;
        return acc + (product?.qty_ordered || 0) * skuQuantity;
      },
      0
    );
  }, [dataTableEditPack]);

  const boxValid = useMemo(() => {
    return orderDetail?.list_box_valid?.find((item) => item?.box_id === boxId?.value);
  }, [boxId?.value, orderDetail?.list_box_valid]);

  const isValidAddBox = useMemo(() => {
    if (boxId && poItemId) {
      return false;
    } else return true;
  }, [boxId, poItemId]);

  const qtyWithItem = useMemo(() => {
    return filteredArraySame?.find(
      (item) => item?.retailer_purchase_order_item?.id === poItemId?.value
    );
  }, [filteredArraySame, poItemId?.value]);

  const isMaxQty = useMemo(() => {
    if (!boxValid?.max_quantity) {
      return false;
    }
    return qty > boxValid?.max_quantity;
  }, [boxValid, qty]);

  const getProductValueById = useMemo(() => {
    const item = orderDetail?.items?.find((item) => item?.id === poItemId?.value);
    return item?.product_alias?.product as never;
  }, [orderDetail?.items, poItemId]);

  const getObjectWithId = useMemo(() => {
    return orderPackageNotShip
      ?.flatMap((item: any) => item?.order_item_packages)
      ?.filter((item) => item?.retailer_purchase_order_item?.id === poItemId?.value);
  }, [orderPackageNotShip, poItemId?.value]);

  const handleSubmitCreate = async () => {
    const body = {
      box: dataTableEditPack?.box?.id,
      items: dataTableEditPack?.order_item_packages?.map((item) => ({
        order_item: item?.idSku,
        quantity: item?.qty_ordered
      }))
    };

    try {
      dispatch(actions.createBulkBoxPackageRequest());
      await services.createBulkBoxPackageService(body, +orderDetail?.id);
      dispatch(actions.createBulkBoxPackageSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Create Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      const dataOrder = await services.getOrderDetailServer(+params?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      onCloseModal();
    } catch (error: any) {
      dispatch(actions.createBulkBoxPackageFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Error'
        })
      );
    }
  };

  const onCloseModal = () => {
    reset();
    onModalMenuToggle();
    setDataTablePack(null);
    setIsItemEdit(false);
  };

  const handleGetBox = useCallback(async () => {
    try {
      if (getProductValueById) {
        boxDispatch(getBoxRequest());
        const dataBox = await getBoxService({
          search: debouncedSearchTerm || '',
          page,
          rowsPerPage,
          product_id: getProductValueById
        });
        boxDispatch(getBoxSuccess(dataBox));
      }
    } catch (error: any) {
      boxDispatch(getBoxFailure(error));
    }
  }, [boxDispatch, debouncedSearchTerm, getProductValueById, page, rowsPerPage]);

  const handleAddBox = async (
    qty: number,
    poItem: { value: number; label: string },
    box: { value: number; label: string }
  ) => {
    const orderItemPackages = dataTableEditPack?.order_item_packages || [];
    const existingPackageIndex = orderItemPackages.findIndex(
      (packageItem) => packageItem?.idSku === poItem?.value
    );

    const listItem = (dataTableEditPack?.order_item_packages || []).map((item) => {
      return {
        order_item: +item?.idSku,
        quantity:
          item.idSku === poItem.value ? (+item?.qty_ordered || 0) + +qty : +item?.qty_ordered || 0
      };
    });

    const body = {
      box: +box?.value,
      list_item:
        existingPackageIndex !== -1
          ? listItem
          : [...listItem, { order_item: +poItem?.value, quantity: +qty }]
    };
    try {
      dispatch(actions.createBoxPackageRequest());
      await services.createBoxPackageService(true, body);
      dispatch(actions.createBoxPackageSuccess());
      const productAlias = orderDetail?.items?.find(
        (item) => item.id === poItem?.value
      ) as unknown as RetailerPurchaseOrderItem;

      if (existingPackageIndex !== -1) {
        const updatedDataTableEditPack = { ...dataTableEditPack };
        if (updatedDataTableEditPack?.order_item_packages) {
          updatedDataTableEditPack.order_item_packages[existingPackageIndex].qty_ordered += +qty;
          setDataTablePack(updatedDataTableEditPack as ItemTableAddBox);
        }
      } else {
        const newPackage: ItemOrderItemPack = {
          idSku: poItem?.value,
          qty_ordered: +qty,
          sku: poItem?.label,
          sku_quantity: productAlias?.product_alias?.sku_quantity
        };

        const updatedDataTableEditPack = {
          box: { id: box?.value, name: box?.label, box_max_quantity: boxValid?.max_quantity || 0 },
          order_item_packages: [...(dataTableEditPack?.order_item_packages || []), newPackage]
        };

        setDataTablePack(updatedDataTableEditPack as ItemTableAddBox);
      }
      handleCancel();
    } catch (error: any) {
      dispatch(actions.createBoxPackageFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Error'
        })
      );
    }
  };

  const handleEditBox = async (item: ItemTableAddBox, orderItemPack: ItemOrderItemPack) => {
    setIsItemEdit(true);
    setValue('box_id', {
      value: item?.box?.id,
      label: item?.box?.name
    });
    setValue('qty', +orderItemPack?.qty_ordered);
    setValue('po_item_id', {
      value: orderItemPack?.idSku,
      label: orderItemPack?.sku
    });
  };

  const handleCancel = () => {
    setIsItemEdit(false);
    setValue('qty', 0);
    setValue('po_item_id', null);
  };

  const handleDeleteBox = (idSku: number) => {
    setIsItemEdit(false);
    const updatedPackages = dataTableEditPack?.order_item_packages?.filter(
      (packageItem) => packageItem?.idSku !== idSku
    );

    if (dataTableEditPack?.order_item_packages?.length === 1) {
      setDataTablePack(null);
    } else {
      setDataTablePack(
        (prevState) =>
          ({
            ...prevState,
            order_item_packages: updatedPackages
          } as ItemTableAddBox)
      );
    }
  };

  const handleUpdateBox = async (
    qty: number,
    poItem: { value: number; label: string },
    box: { value: number; label: string }
  ) => {
    const itemIndex = dataTableEditPack?.order_item_packages?.findIndex(
      (item) => item?.idSku === poItem?.value
    );
    const body = {
      box: +box?.value,
      list_item: dataTableEditPack?.order_item_packages?.map((item) => ({
        order_item: Number(item?.idSku === poItem?.value ? poItem?.value : item?.idSku),
        quantity: Number(item?.idSku === poItem?.value ? qty : item?.qty_ordered)
      }))
    };

    try {
      dispatch(actions.createBoxPackageRequest());
      await services.createBoxPackageService(true, body);
      dispatch(actions.createBoxPackageSuccess());

      if (itemIndex !== -1) {
        const updatedDataTableEditPack = {
          ...dataTableEditPack,
          order_item_packages: dataTableEditPack?.order_item_packages?.map((item, index) => {
            if (index === itemIndex) {
              return {
                ...item,
                qty_ordered: +qty
              };
            }
            return item;
          }),
          box: {
            id: box.value,
            name: box.label,
            box_max_quantity: boxValid?.max_quantity || 0
          }
        };

        setDataTablePack(updatedDataTableEditPack as ItemTableAddBox);
        handleCancel();
      }
    } catch (error: any) {
      dispatch(actions.createBoxPackageFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Error'
        })
      );
    }
  };

  const handleChangeBox = (data: { label: string; value: number }) => {
    if (dataTableEditPack && dataTableEditPack.box.id === boxId?.value) {
      handleToggleModal();
    }
    setValue('box_id', {
      label: data?.label,
      value: data?.value
    });
  };

  const handleCloseModal = () => {
    setValue('box_id', {
      label: dataTableEditPack?.box?.name,
      value: dataTableEditPack?.box?.id
    });
    handleToggleModal();
  };

  const handleConfirmDeleteTable = () => {
    handleToggleModal();
    setDataTablePack(null);
    setIsItemEdit(false);
  };

  useEffect(() => {
    handleGetBox();
  }, [handleGetBox]);

  useEffect(() => {
    if (filteredArraySame?.length === 1 && !isItemEdit) {
      setValue('po_item_id', {
        value: filteredArraySame?.[0]?.retailer_purchase_order_item?.id,
        label: filteredArraySame?.[0]?.retailer_purchase_order_item?.product_alias?.sku
      });
      setValue(
        'qty',
        (filteredArraySame?.[0]?.retailer_purchase_order_item?.qty_ordered as never) -
          getObjectWithId?.reduce((total, obj) => total + obj?.quantity, 0)
      );
    } else if (filteredArraySame?.length > 1 && qtyWithItem && !isItemEdit) {
      setValue(
        'qty',
        (qtyWithItem?.retailer_purchase_order_item?.qty_ordered as never) -
          getObjectWithId?.reduce((total, obj) => total + obj?.quantity, 0)
      );
    } else if (!isItemEdit) {
      setValue('qty', 0);
    }
  }, [setValue, filteredArraySame, qtyWithItem, getObjectWithId, isItemEdit]);

  return (
    <Modal width="w-[560px]" open={open} title={'Add New Box'} onClose={onCloseModal}>
      <div className="max-h-[600px] overflow-auto">
        <form className="flex flex-col gap-4" noValidate>
          <div>
            <Controller
              control={control}
              name="po_item_id"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    filteredArraySame?.length === 1
                      ? filteredArraySame?.map((item) => ({
                          value: item?.retailer_purchase_order_item?.id,
                          label: item?.retailer_purchase_order_item?.product_alias?.sku
                        }))
                      : orderDetail?.items?.map((item) => ({
                          value: item?.id,
                          label: item?.product_alias?.sku
                        }))
                  }
                  required
                  addNew={false}
                  placeholder="Select Item"
                  label="Item"
                  name="po_item_id"
                  className="border-none px-3 py-2"
                  error={errors.po_item_id?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="box_id"
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    dataBox?.results?.map((item) => ({
                      value: item?.id,
                      label: item?.name
                    })) || []
                  }
                  onChange={(data: { label: string; value: number }) => handleChangeBox(data)}
                  label={
                    <>
                      <p className="mr-1">Box </p>
                      <Tooltip content="Please note that if you change the box, all items previously added to the box will be removed.">
                        <Image src="/question-icon.svg" width={16} height={16} alt="question" />
                      </Tooltip>
                    </>
                  }
                  required
                  handleChangeText={handleSearch}
                  placeholder="Select Box"
                  name="box_id"
                  className="border-none px-3 py-2"
                  addNew={false}
                  error={errors.box_id?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="qty"
              render={({ field }) => (
                <Input
                  {...field}
                  label="Quantity"
                  type="number"
                  required
                  name="qty"
                  error={errors.qty?.message}
                />
              )}
            />
          </div>

          <div className="mb-[24px] flex items-center justify-end">
            {isItemEdit ? (
              <>
                <Button
                  type="button"
                  onClick={handleCancel}
                  color="dark:bg-gunmetal bg-buttonLight"
                  className="mr-4"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoadingCreatePackageBox}
                  type="button"
                  disabled={isLoadingCreatePackageBox || isMaxQty || isValidAddBox}
                  onClick={() => handleUpdateBox(qty, poItemId, boxId)}
                  color="bg-primary500"
                >
                  Update
                </Button>
              </>
            ) : (
              <Button
                startIcon={<IconPlus />}
                isLoading={isLoadingCreatePackageBox}
                type="button"
                disabled={isLoadingCreatePackageBox || isMaxQty || isValidAddBox}
                onClick={() => handleAddBox(qty, poItemId, boxId)}
                color="bg-primary500"
                className="w-[73px]"
              >
                Add
              </Button>
            )}
          </div>

          <TableAddNewBox
            columns={headerTableAddNewBox}
            dataTableEditPack={dataTableEditPack}
            skuQuantity={skuQuantity}
            handleEditBox={handleEditBox}
            handleDeleteBox={handleDeleteBox}
          />

          <div className="flex justify-end gap-2">
            <Button color="dark:bg-gunmetal bg-buttonLight" onClick={onCloseModal} type="button">
              Abort
            </Button>
            <Button
              disabled={Boolean(!dataTableEditPack) || isLoadingCreateBulkPackageBox}
              isLoading={isLoadingCreateBulkPackageBox}
              color="bg-primary500"
              type="button"
              onClick={handleSubmitCreate}
            >
              Create new box
            </Button>
          </div>
        </form>
      </div>
      <ModalConfirmDeleteBox
        handleConfirmDeleteTable={handleConfirmDeleteTable}
        handleCloseModal={handleCloseModal}
        openModal={openModal}
      />
    </Modal>
  );
};
