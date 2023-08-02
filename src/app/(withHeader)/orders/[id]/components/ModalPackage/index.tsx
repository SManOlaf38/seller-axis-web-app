import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useParams } from 'next/navigation';

import { useStoreBox } from '@/app/(withHeader)/box/context';
import { useStore } from '@/app/(withHeader)/orders/context';
import { getBoxFailure, getBoxRequest, getBoxSuccess } from '@/app/(withHeader)/box/context/action';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { getBoxService } from '@/app/(withHeader)/box/fetch';
import { FormCreateBoxPackage, Order } from '@/app/(withHeader)/orders/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { Input } from '@/components/ui/Input';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';

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
  totalMaxQuantity: number;
  onModalMenuToggle: () => void;
  orderDetail: Order;
};

export const InviteMember = ({
  open,
  onModalMenuToggle,
  orderDetail,
  totalMaxQuantity
}: InviteMember) => {
  const params = useParams();
  const {
    state: { dataBox },
    dispatch: boxDispatch
  } = useStoreBox();
  const {
    state: { isLoadingCreatePackageBox },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { search, debouncedSearchTerm, handleSearch } = useSearch();
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
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schema)
  });
  const poItemId = watch('po_item_id');
  const qty = watch('qty');

  const isMaxQty = useMemo(() => {
    return qty > totalMaxQuantity;
  }, [qty, totalMaxQuantity]);

  const getProductValueById = useMemo(() => {
    const item = orderDetail?.items?.find((item) => item?.id === poItemId?.value);
    return item?.product_alias?.product as never;
  }, [orderDetail?.items, poItemId]);

  const handleSubmitCreate = async (data: FormCreateBoxPackage) => {
    try {
      dispatch(actions.createBoxPackageRequest());
      await services.createBoxPackageService({
        box_id: +data?.box_id?.value,
        po_item_id: +data?.po_item_id?.value,
        qty: +data?.qty
      });
      dispatch(actions.createBoxPackageSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Create Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      const dataOrder = await services.getOrderDetailServer(params?.id.toString());
      dispatch(actions.setOrderDetail(dataOrder));
      onCloseModal();
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

  const onCloseModal = () => {
    reset();
    onModalMenuToggle();
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

  useEffect(() => {
    handleGetBox();
  }, [handleGetBox]);

  return (
    <Modal open={open} title={'Add New Box'} onClose={onCloseModal}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSubmitCreate)} noValidate>
        <div>
          <Controller
            control={control}
            name="po_item_id"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={
                  orderDetail?.items?.map((item) => ({
                    value: item?.id,
                    label: item?.vendor_sku
                  })) || []
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
                required
                handleChangeText={handleSearch}
                placeholder="Select Box"
                label="Box"
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
                placeholder="0"
                name="qty"
                error={errors.qty?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button color="dark:bg-gunmetal bg-buttonLight" onClick={onCloseModal} type="button">
            Cancel
          </Button>
          <Button
            isLoading={isLoadingCreatePackageBox}
            disabled={isLoadingCreatePackageBox || isMaxQty}
            color="bg-primary500"
            type="submit"
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
