'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';

import { useStore as useStoreOrg } from '@/app/(withHeader)/organizations/context';
import { getInvoiceService } from '@/app/(withHeader)/orders/fetch';
import * as actionsInvoice from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreInvoice } from '@/app/(withHeader)/orders/context';
import { useStore } from '@/app/(withHeader)/retailers/context';
import * as actions from '@/app/(withHeader)/retailers/context/action';
import * as services from '@/app/(withHeader)/retailers/fetch';
import { DATA_TYPE, ReferenceKey, schemaRetailer } from '../../constants';
import { CreateRetailer, ShipRefTypeResult } from '../../interface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import usePagination from '@/hooks/usePagination';
import Autocomplete from '@/components/ui/Autocomplete';
import { useStore as useStoreCarrier } from '@/app/(withHeader)/carriers/context';
import { useStore as useStoreWarehouse } from '@/app/(withHeader)/warehouse/context';
import * as actionsRetailerCarrier from '@/app/(withHeader)/carriers/context/action';
import * as servicesRetailerCarrier from '@/app/(withHeader)/carriers/fetch';
import * as actionsWarehouse from '@/app/(withHeader)/warehouse/context/action';
import * as servicesWarehouse from '@/app/(withHeader)/warehouse/fetch';
import useSearch from '@/hooks/useSearch';
import { useStoreGs1 } from '@/app/(withHeader)/gs1/context';
import { getGs1Failure, getGs1Request, getGs1Success } from '@/app/(withHeader)/gs1/context/action';
import { getGs1Service } from '@/app/(withHeader)/gs1/fetch';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { DataCountryRegion, ReferenceNameRegex } from '@/constants';
import ReferenceRetailer from '../../components/ReferenceRetailer';
import { hasMismatch } from '@/utils/utils';
import Tooltip from '@/components/ui/Tooltip';

dayjs.extend(utc);
dayjs.extend(timezone);

const NewRetailerContainer = () => {
  const router = useRouter();
  const { page, rowsPerPage } = usePagination();
  const params = useParams();
  const {
    state: { isLoadingCreate, detailRetailer, errorMessage, dataSFTP, dataShipRefType },
    dispatch
  } = useStore();
  const {
    state: { organizations }
  } = useStoreOrg();
  const { dispatch: dispatchInvoice } = useStoreInvoice();
  const currentOrganization = Cookies.get('current_organizations');
  const currentLocalTime = dayjs().utc();

  const servicesShip = useMemo(() => {
    return dataShipRefType.results?.map((item: ShipRefTypeResult) => item?.name);
  }, [dataShipRefType.results]);

  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { dataRetailerCarrier },
    dispatch: dispatchRetailerCarrier
  } = useStoreCarrier();

  const {
    state: { dataGs1 },
    dispatch: Gs1Dispatch
  } = useStoreGs1();

  const {
    state: { dataRetailerWarehouse },
    dispatch: dispatchWarehouse
  } = useStoreWarehouse();

  const [valueReference, setValueReference] = useState({
    shipping_ref_1: {
      name: '',
      data_field: null,
      id: null
    },
    shipping_ref_2: {
      name: '',
      data_field: null,
      id: null
    },
    shipping_ref_3: {
      name: '',
      data_field: null,
      id: null
    },
    shipping_ref_4: {
      name: '',
      data_field: null,
      id: null
    },
    shipping_ref_5: {
      name: '',
      data_field: null,
      id: null
    }
  });

  const {
    debouncedSearchTerm: debouncedSearchTermRetailerCarrier,
    handleSearch: handleSearchRetailerCarrier
  } = useSearch();

  const { debouncedSearchTerm: debouncedSearchTermWarehouse, handleSearch: handleSearchWarehouse } =
    useSearch();

  const defaultValues = {
    name: '',
    type: 'CommerceHub',
    merchant_id: '',
    remit_id: '',
    qbo_customer_ref_id: '',
    vendor_id: '',
    default_carrier: null,
    default_warehouse: null,
    default_gs1: null,

    ship_from_address: {
      company: '',
      contact_name: '',
      address_1: '',
      address_2: '',
      city: '',
      country: '',
      phone: '',
      postal_code: '',
      state: ''
    },

    retailer_sftp: {
      sftp_host: '',
      sftp_username: '',
      sftp_password: ''
    },

    shipping_ref_1_value: '',
    shipping_ref_2_value: '',
    shipping_ref_3_value: '',
    shipping_ref_4_value: '',
    shipping_ref_5_value: '',
    shipping_ref_1_type: null,
    shipping_ref_2_type: null,
    shipping_ref_3_type: null,
    shipping_ref_4_type: null,
    shipping_ref_5_type: null
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaRetailer)
  });
  const platform = watch('type');
  const shipping1 = watch('shipping_ref_1_value');
  const shipping2 = watch('shipping_ref_2_value');
  const shipping3 = watch('shipping_ref_3_value');
  const shipping4 = watch('shipping_ref_4_value');
  const shipping5 = watch('shipping_ref_5_value');
  const contactName = watch('contact_name');

  const isValid = useMemo(() => {
    return (
      hasMismatch(shipping1, servicesShip) ||
      hasMismatch(shipping2, servicesShip) ||
      hasMismatch(shipping3, servicesShip) ||
      hasMismatch(shipping4, servicesShip) ||
      hasMismatch(shipping5, servicesShip)
    );
  }, [servicesShip, shipping1, shipping2, shipping3, shipping4, shipping5]);

  const handleGetInvoice = useCallback(async () => {
    try {
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipRequest());
      const res = await getInvoiceService();
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipSuccess());
      localStorage.setItem('retailer', 'create_retailer');
      window.open(res?.auth_url, '_self');
    } catch (error: any) {
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  }, [dispatchAlert, dispatchInvoice]);

  const handleCreateRetailer = async (data: CreateRetailer) => {
    if (
      currentOrganization &&
      organizations[currentOrganization]?.qbo_refresh_token_exp_time &&
      dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
        .utc()
        .isAfter(currentLocalTime)
    ) {
      try {
        const body = {
          retailer_sftp: {
            sftp_host: data?.sftp_host,
            sftp_username: data?.sftp_username,
            sftp_password: data?.sftp_password
          },
          ship_from_address: {
            company: data?.company,
            contact_name: data?.contact_name,
            address_1: data?.address_1,
            address_2: data?.address_2,
            city: data?.city,
            country: data?.country,
            phone: data?.phone,
            postal_code: data?.postal_code,
            state: data?.state
          },
          name: data?.name,
          type: data?.type,
          merchant_id: data?.merchant_id,
          remit_id: data?.remit_id,
          vendor_id: data?.vendor_id,
          default_carrier: data?.default_carrier?.value,
          default_warehouse: data?.default_warehouse?.value || null,
          default_gs1: data?.default_gs1?.value || null,
          shipping_ref_1_value: data?.shipping_ref_1_value,
          shipping_ref_2_value: data?.shipping_ref_2_value,
          shipping_ref_3_value: data?.shipping_ref_3_value,
          shipping_ref_4_value: data?.shipping_ref_4_value,
          shipping_ref_5_value: data?.shipping_ref_5_value,
          shipping_ref_1_type: valueReference.shipping_ref_1?.id || null,
          shipping_ref_2_type: valueReference.shipping_ref_2?.id || null,
          shipping_ref_3_type: valueReference.shipping_ref_3?.id || null,
          shipping_ref_4_type: valueReference.shipping_ref_4?.id || null,
          shipping_ref_5_type: valueReference.shipping_ref_5?.id || null
        };
        if (params?.id) {
          dispatch(actions.updateRetailerRequest());
          await services.updateRetailerService(body, +params?.id);
          dispatch(actions.updateRetailerSuccess());
          dispatchAlert(
            openAlertMessage({
              message: 'Update Retailer Successfully',
              color: 'success',
              title: 'Success'
            })
          );
          router.push('/retailers');
        } else {
          dispatch(actions.createRetailerRequest());
          await services.createRetailerService(body);
          dispatch(actions.createRetailerSuccess());
          dispatchAlert(
            openAlertMessage({
              message: 'Create Retailer Successfully',
              color: 'success',
              title: 'Success'
            })
          );
          router.push('/retailers');
        }
      } catch (error: any) {
        if (params?.id) {
          dispatch(actions.updateRetailerFailure(error?.message));
          dispatchAlert(
            openAlertMessage({
              message: error?.message || 'Update Retailer Fail',
              color: 'error',
              title: 'Fail'
            })
          );
        } else {
          dispatch(actions.createRetailerFailure(error?.message));
          dispatchAlert(
            openAlertMessage({
              message: error?.message || 'Create Retailer Fail',
              color: 'error',
              title: 'Fail'
            })
          );
        }
      }
    } else {
      handleGetInvoice();
    }
  };

  const getDetailRetailer = async () => {
    try {
      dispatch(actions.getDetailRetailerRequest());
      const response = await services.getDetailRetailerService(+params?.id);
      dispatch(actions.getDetailRetailerSuccess(response));
    } catch (error: any) {
      dispatch(actions.getDetailRetailerFailure(error.message));
    }
  };

  const handleGetSFTP = useCallback(async () => {
    try {
      dispatch(actions.getSFTPRequest());
      const responseSftp = await services.getSFTPService({
        search: params?.id.toString(),
        page
      });
      dispatch(actions.getSFTPSuccess(responseSftp));
    } catch (error) {
      dispatch(actions.getSFTPFailure(error));
    }
  }, [dispatch, page, params?.id]);

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseRequest());
      const dataProduct = await servicesWarehouse.getRetailerWarehouseService({
        search: debouncedSearchTermWarehouse,
        page,
        rowsPerPage: 100
      });
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseFailure(error));
    }
  }, [dispatchWarehouse, page, debouncedSearchTermWarehouse]);

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierRequest());
      const dataProduct = await servicesRetailerCarrier.getRetailerCarrierService({
        search: debouncedSearchTermRetailerCarrier,
        page,
        rowsPerPage: 100
      });
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierFailure(error));
    }
  }, [dispatchRetailerCarrier, page, debouncedSearchTermRetailerCarrier]);

  const handleGetGs1 = useCallback(async () => {
    try {
      Gs1Dispatch(getGs1Request());
      const dataGs1 = await getGs1Service({
        search: '',
        page,
        rowsPerPage
      });
      Gs1Dispatch(getGs1Success(dataGs1));
    } catch (error: any) {
      Gs1Dispatch(getGs1Failure(error));
    }
  }, [Gs1Dispatch, page, rowsPerPage]);

  const handleGetShipRefType = useCallback(async () => {
    try {
      dispatch(actions.getShipRefTypeRequest());
      const res = await services.getShipRefTypeService({
        page: 0,
        rowsPerPage: -1
      });
      dispatch(actions.getShipRefTypeSuccess(res));
    } catch (error: any) {
      dispatch(actions.getShipRefTypeFailure(error));
    }
  }, [dispatch]);

  const handleSelectRef = (item: ShipRefTypeResult, keyRef: ReferenceKey) => {
    const updatedValues = { ...valueReference };
    let valueRef = watch(`${keyRef}_value`) || '';

    if (ReferenceNameRegex.test(valueRef)) {
      valueRef = valueRef.replace(ReferenceNameRegex, `{{${item.name}}}`);
    } else {
      valueRef = valueRef + `{{${item.name}}}`;
    }

    setValue(`${keyRef}_value`, valueRef);
    updatedValues[keyRef] = { name: item.name, id: item.id as never, data_field: item?.data_field };
    setValueReference(updatedValues);
  };

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  useEffect(() => {
    handleGetRetailerCarrier();
    handleGetGs1();
    handleGetShipRefType();
  }, [handleGetGs1, handleGetRetailerCarrier, handleGetShipRefType]);

  useEffect(() => {
    handleGetSFTP();
  }, [handleGetSFTP]);

  useEffect(() => {
    params?.id && getDetailRetailer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (
      (currentOrganization &&
        dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
          .utc()
          .isBefore(currentLocalTime)) ||
      (currentOrganization &&
        organizations[currentOrganization]?.qbo_refresh_token_exp_time === null)
    ) {
      dispatchAlert(
        openAlertMessage({
          color: 'warning',
          customTimeHide: 6000,
          action: (
            <div className="flex max-w-[374px] items-start pr-[20px]">
              {organizations[currentOrganization]?.qbo_refresh_token_exp_time === null ? (
                <span className="text-[16px] leading-6 text-white">
                  You have not login the QuickBooks account. Please click the{' '}
                  <span
                    className="cursor-pointer whitespace-normal break-words text-[16px] text-dodgeBlue underline"
                    onClick={handleGetInvoice}
                  >
                    LINK
                  </span>{' '}
                  to access your QuickBooks account to continue
                </span>
              ) : (
                <span className="text-[16px] leading-6 text-white">
                  Your QuickBooks access code has expired.
                  <br /> Kindly click the{' '}
                  <span
                    className="cursor-pointer whitespace-normal break-words text-[16px] text-dodgeBlue underline"
                    onClick={handleGetInvoice}
                  >
                    LINK
                  </span>{' '}
                  to sign in to QuickBooks once again
                </span>
              )}
            </div>
          )
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization, dispatchAlert, handleGetInvoice, organizations]);

  useEffect(() => {
    const detailRetailerSFTP = dataSFTP?.results?.[0];
    if (detailRetailer && params?.id) {
      reset({
        ...detailRetailer,
        ...detailRetailerSFTP,
        ...detailRetailer?.ship_from_address,
        default_warehouse: {
          label: detailRetailer.default_warehouse?.name,
          value: detailRetailer.default_warehouse?.id
        },
        default_carrier: {
          label:
            detailRetailer?.default_carrier &&
            `${detailRetailer?.default_carrier?.account_number || '-'} - Service: ${
              detailRetailer?.default_carrier?.service?.name
            } Shipper: ${detailRetailer?.default_carrier?.shipper?.name || '-'}`,
          value: detailRetailer?.default_carrier && detailRetailer?.default_carrier?.id
        },
        default_gs1: {
          label: detailRetailer?.default_gs1?.name,
          value: detailRetailer?.default_gs1?.id
        }
      });
    }
  }, [dataSFTP?.results, detailRetailer, params?.id, reset]);

  useEffect(() => {
    if (detailRetailer && params?.id) {
      for (let i = 1; i <= 5; i++) {
        const key = `shipping_ref_${i}`;
        const typeId = detailRetailer[key + '_type'];

        if (typeId !== null) {
          const type = dataShipRefType.results?.find(
            (item: ShipRefTypeResult) => item?.id === typeId
          ) as unknown as ShipRefTypeResult;

          if (type) {
            setValueReference((prevState) => ({
              ...prevState,
              [key]: {
                name: type?.name,
                data_field: type?.data_field,
                id: typeId
              }
            }));
          }
        }
      }
    }
  }, [detailRetailer, dataShipRefType, params?.id]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {params?.id ? 'Update Retailer' : 'Create Retailer'}
      </h2>
      <div>
        <form
          noValidate
          onSubmit={handleSubmit(handleCreateRetailer)}
          className="grid w-full grid-cols-4 gap-2"
        >
          <div className="col-span-2 flex flex-col gap-2">
            <div className="grid w-full grid-cols-1 gap-4">
              <Card>
                <div className="flex w-full flex-col gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={DATA_TYPE}
                          name="type"
                          label="Platforms"
                          required
                          error={errors.type?.message as string}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Name"
                          required
                          name="name"
                          placeholder="Enter name : ABC..."
                          error={errors.name?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="merchant_id"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Merchant ID"
                          required
                          name="merchant_id"
                          placeholder="Enter merchant ID"
                          error={errors.merchant_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="qbo_customer_ref_id"
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled
                          label="Quick books Customer ID"
                          name="qbo_customer_ref_id"
                          error={errors.qbo_customer_ref_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="vendor_id"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Vendor ID"
                          required
                          name="vendor_id"
                          placeholder="Enter Vendor ID : ABC..."
                          error={errors.vendor_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="remit_id"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label={
                            <>
                              <p className="mr-1">Remit ID </p>
                              <Tooltip content="The entity to be paid. Often used to convey an account number for the entity in the merchant’s A/P system.">
                                <Image
                                  src="/question-icon.svg"
                                  width={16}
                                  height={16}
                                  alt="question"
                                />
                              </Tooltip>
                            </>
                          }
                          required
                          name="remit_id"
                          placeholder="Enter Remit ID"
                          error={errors.remit_id?.message}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name="default_warehouse"
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={[
                            {
                              label: 'None',
                              value: null
                            },
                            ...(dataRetailerWarehouse.results || [])?.map((item) => ({
                              label: item?.name,
                              value: item?.id
                            }))
                          ]}
                          handleChangeText={handleSearchWarehouse}
                          label="Default warehouse"
                          name="default_warehouse"
                          placeholder="Select default warehouse"
                          onReload={handleGetRetailerWarehouse}
                          pathRedirect="/warehouse/create"
                          error={errors.default_warehouse?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="default_carrier"
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={[
                            {
                              label: 'None',
                              value: null
                            },
                            ...(dataRetailerCarrier.results || [])?.map((item) => ({
                              label: `${item?.account_number} - Service: ${item?.service?.name} Shipper: ${item?.shipper?.name}`,
                              value: item?.id
                            }))
                          ]}
                          handleChangeText={handleSearchRetailerCarrier}
                          label="Default carrier"
                          name="default_carrier"
                          placeholder="Select default carrier"
                          onReload={handleGetRetailerCarrier}
                          pathRedirect="/carriers/create"
                          error={errors.default_carrier?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <div className="grid w-full grid-cols-1 gap-4">
                <Card>
                  <Controller
                    control={control}
                    name="default_gs1"
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={[
                          {
                            label: 'None',
                            value: 0
                          },
                          ...(dataGs1 || [])?.map((item) => ({
                            label: item?.name,
                            value: item?.id
                          }))
                        ]}
                        label="Default GS1"
                        name="default_gs1"
                        placeholder="Select default GS1"
                        onReload={handleGetGs1}
                        pathRedirect="/gs1/create"
                        error={errors.default_gs1?.message}
                      />
                    )}
                  />
                </Card>
              </div>
            </div>
            <ReferenceRetailer
              valueReference={valueReference}
              handleSelectRef={handleSelectRef}
              errors={errors}
              control={control}
              servicesShip={servicesShip}
              watch={watch}
            />
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <div className="grid w-full grid-cols-1">
              <Card className="flex w-full flex-col gap-4">
                <div>
                  <Controller
                    control={control}
                    name="sftp_host"
                    render={({ field }) => (
                      <Input
                        {...field}
                        required
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP host"
                        label="SFTP host"
                        name="sftp_host"
                        error={errors.sftp_host?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="sftp_username"
                    render={({ field }) => (
                      <Input
                        {...field}
                        required
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP username"
                        label="SFTP username"
                        name="sftp_username"
                        error={errors.sftp_username?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="sftp_password"
                    render={({ field }) => (
                      <Input
                        {...field}
                        required
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP password"
                        label="SFTP password"
                        type="password"
                        name="sftp_password"
                        error={errors.sftp_password?.message}
                      />
                    )}
                  />
                </div>
              </Card>

              <Card className="mt-2">
                <p className="mb-4">Ship From</p>
                <div className="flex w-full flex-col gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="company"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Company"
                          name="company"
                          placeholder="Enter company"
                          error={errors.company?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="contact_name"
                      render={({ field }) => (
                        <Input
                          {...field}
                          required
                          label="Name"
                          name="contact_name"
                          placeholder="Enter name"
                          error={errors.contact_name?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="address_1"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address 1"
                          required
                          name="address_1"
                          placeholder="Enter address 1"
                          error={errors.address_1?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="address_2"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Address 2"
                          name="address_2"
                          placeholder="Enter address 2"
                          error={errors.address_2?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="City"
                          required
                          name="city"
                          placeholder="Enter city"
                          error={errors.city?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <Select
                          {...field}
                          required
                          label="Country"
                          options={DataCountryRegion}
                          name="country"
                          error={errors?.country?.message as string}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Phone"
                          required
                          name="phone"
                          placeholder="Enter Phone"
                          error={errors.phone?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="postal_code"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="Postal code"
                          required
                          name="postal_code"
                          placeholder="Enter postal code"
                          error={errors.postal_code?.message}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="state"
                      render={({ field }) => (
                        <Input
                          {...field}
                          label="State"
                          required
                          name="state"
                          placeholder="Enter State"
                          error={errors.state?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>

              <div className="my-[16px] flex justify-end">
                <Button
                  type="submit"
                  isLoading={isLoadingCreate}
                  disabled={isLoadingCreate || isValid}
                  className="bg-primary500"
                >
                  {params?.id ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NewRetailerContainer;
