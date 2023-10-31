'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreOrganization } from '@/app/(withHeader)/organizations/context';
import * as actionsOrganization from '@/app/(withHeader)/organizations/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { useStore } from '@/app/(withHeader)/orders/context';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { createInvoiceService } from '@/app/(withHeader)/orders/fetch';
import LoadingOrder from '../components/LoadingOrder';
import LoadingProduct from '../components/LoadingProduct';
import { OrganizationKeyType } from '../../organizations/interfaces';
import { getOrganizationsService } from '../../organizations/fetch';
import LoadingRetailer from '../components/LoadingRetailer';

export default function InvoicesContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { dispatch } = useStore();
  const { dispatch: dispatchOrganization } = useStoreOrganization();

  const auth_code = searchParams?.get('code');
  const realm_id = searchParams?.get('realmId');
  const idOrder = window.localStorage.getItem('order_id');
  const product = window.localStorage.getItem('product');
  const retailer = window.localStorage.getItem('retailer');
  const on_invoice = window.localStorage.getItem('on_invoice');

  const createTokenInvoice = async () => {
    try {
      dispatch(actions.createTokenInvoiceRequest());
      await services.createTokenInvoiceService({
        auth_code,
        realm_id
      } as never);
      realm_id && window.localStorage.setItem('realm_id', realm_id);
      dispatch(actions.createTokenInvoiceSuccess());
      if (idOrder) {
        on_invoice && (await onInvoice());
        router.replace(`/orders/${idOrder}`);
      } else if (product) {
        await getOrganizations();
        router.replace('/products/create');
        localStorage.removeItem('product');
      } else if (retailer) {
        await getOrganizations();
        router.replace('/retailers/create');
        localStorage.removeItem('retailer');
      }
    } catch (error: any) {
      dispatch(actions.createTokenInvoiceFailure(error));
      router.replace('/');
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Something went wrong',
          color: 'error',
          title: 'Fail'
        })
      );
      router.replace(`/orders/${idOrder}`);
    }
  };

  const getOrganizations = async () => {
    try {
      dispatchOrganization(actionsOrganization.getOrganizationRequest());
      const data = await getOrganizationsService();

      const convertData = data.results.reduce(
        (
          obj: { organizationsTypeIds: number[]; organizationsTypes: OrganizationKeyType },
          item: { id: number }
        ) => {
          obj.organizationsTypes = { ...obj.organizationsTypes, [item.id]: item };
          obj.organizationsTypeIds.push(item.id);
          return obj;
        },
        {
          organizationsTypeIds: [],
          organizationsTypes: {}
        }
      );

      dispatchOrganization(actionsOrganization.getOrganizationSuccess(convertData));
    } catch (error: any) {
      dispatchOrganization(actionsOrganization.getOrganizationFail(error?.message));
    }
  };

  const onInvoice = async () => {
    try {
      if (realm_id && idOrder) {
        dispatch(actions.createInvoiceRequest());
        await createInvoiceService(+idOrder);
        dispatch(actions.createInvoiceSuccess());
        dispatchAlert(
          openAlertMessage({
            message: 'Submit Invoice Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      }
    } catch (error: any) {
      dispatch(actions.createInvoiceFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
      localStorage.removeItem('realm_id');
    }
  };

  useEffect(() => {
    if (auth_code && realm_id) {
      createTokenInvoice();
    } else if (idOrder) {
      router.push(`/orders/${idOrder}`);
    } else {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth_code, realm_id, router, idOrder]);

  return <>{idOrder ? <LoadingOrder /> : product ? <LoadingProduct /> : <LoadingRetailer />}</>;
}
