'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { useStore } from '@/app/(withHeader)/orders/context';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../../orders/[id]/components/InfoOrder';
import { InputSkeleton } from '@/components/ui/InputSkeleton';
import { createInvoiceService, getOrderDetailServer } from '@/app/(withHeader)/orders/fetch';

export default function InvoicesContainer({
  refresh_token_invoice
}: {
  refresh_token_invoice?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { dispatch } = useStore();

  const auth_code = searchParams?.get('code');
  const realm_id = searchParams?.get('realmId');
  const idOrder = localStorage.getItem('order_id');

  const createTokenInvoice = async () => {
    try {
      dispatch(actions.createTokenInvoiceRequest());
      const res = await services.createTokenInvoiceService({
        auth_code,
        realm_id
      } as never);
      Cookies.set('access_token_invoice', res?.access_token);
      Cookies.set('refresh_token_invoice', res?.refresh_token);
      realm_id && localStorage.setItem('realm_id', realm_id);
      dispatch(actions.createTokenInvoiceSuccess());
      onInvoice(res?.access_token);
      router.push(`/orders/${idOrder}`);
    } catch (error: any) {
      dispatch(actions.createTokenInvoiceFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Something went wrong',
          color: 'error',
          title: 'Fail'
        })
      );
      router.push(`/orders/${idOrder}`);
    }
  };

  const onInvoice = async (token: string) => {
    try {
      if (realm_id && idOrder) {
        dispatch(actions.createInvoiceRequest());
        await createInvoiceService(+idOrder, {
          access_token: token,
          realm_id
        });
        dispatch(actions.createInvoiceSuccess());
        const dataOrder = await getOrderDetailServer(+idOrder);
        dispatch(actions.setOrderDetail(dataOrder));
        dispatchAlert(
          openAlertMessage({
            message: 'Submit Invoice Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      }
    } catch (error: any) {
      if (error?.message === '"Access token has expired!"') {
        refreshTokenInvoice();
      } else {
        dispatch(actions.createInvoiceFailure(error.message));
        dispatchAlert(
          openAlertMessage({
            message: error?.message,
            color: 'error',
            title: 'Fail'
          })
        );
        localStorage.removeItem('realm_id');
        Cookies.remove('access_token_invoice');
        Cookies.remove('refresh_token_invoice');
      }
    }
  };

  const refreshTokenInvoice = async () => {
    try {
      dispatch(actions.refreshTokenInvoiceRequest());
      const res = await services.refreshTokenService({
        refresh_token: refresh_token_invoice as never
      });
      dispatch(actions.refreshTokenInvoiceSuccess());

      if (res?.access_token) {
        Cookies.set('access_token_invoice', res?.access_token);
        onInvoice(res?.access_token);
      }
    } catch (error: any) {
      localStorage.removeItem('realm_id');
      Cookies.remove('access_token_invoice');
      Cookies.remove('refresh_token_invoice');

      dispatch(actions.refreshTokenInvoiceFailure(error.message));
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

  return (
    <main className="relative mb-2">
      <h2 className="my-4 text-lg font-semibold">Purchase Order #: </h2>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
              <div className="mt-4">
                <div className="h-20 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={
                  <div>
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <>
                          <div
                            key={index}
                            className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500"
                          />
                        </>
                      ))}
                  </div>
                }
              />
              <div className="flex items-center justify-end gap-4">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />

                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>

              <InfoOrder
                title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                value={
                  <div>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <>
                          <div
                            key={index}
                            className="my-1 h-4 w-full rounded-lg bg-grey500 dark:bg-gray-500"
                          />
                        </>
                      ))}
                  </div>
                }
              />
              <div className="mt-4 flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="flex justify-end">
                <div className="h-8 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
              <div className="mt-4">
                <div className="h-20 w-full rounded-lg bg-grey500 dark:bg-gray-500" />
              </div>
            </CardToggle>
          </div>
          <div className="flex flex-col gap-2">
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <>
                    <InfoOrder
                      key={index}
                      title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                      value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                    />
                  </>
                ))}
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="grid w-full grid-cols-1 gap-2 ">
                {Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index}>
                      <InputSkeleton />
                    </div>
                  ))}
              </div>
            </CardToggle>
            <CardToggle
              title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
              className="grid w-full grid-cols-1 gap-2"
            >
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <>
                    <InfoOrder
                      key={index}
                      title={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                      value={<div className="h-4 w-20 rounded-lg bg-grey500 dark:bg-gray-500" />}
                    />
                  </>
                ))}
            </CardToggle>
          </div>
        </div>
      </div>
    </main>
  );
}
