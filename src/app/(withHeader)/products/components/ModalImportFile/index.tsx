import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { getInvoiceService } from '@/app/(withHeader)/orders/fetch';
import * as actionsInvoice from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/products/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import * as actions from '@/app/(withHeader)/products/context/action';
import { useStore } from '@/app/(withHeader)/products/context';
import ImportIcon from 'public/import-icon.svg';
import DeleteIcon from 'public/delete.svg';
import DocIcon from 'public/doc-icon.svg';
import { Modal } from '@/components/ui/Modal';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore as useStoreInvoice } from '@/app/(withHeader)/orders/context';
import { useStore as useStoreOrg } from '@/app/(withHeader)/organizations/context';
import { mapKeys, readFileAsync } from '@/utils/utils';
import { Button } from '@/components/ui/Button';
import FileUpload from '@/app/(withHeader)/product-aliases/components/FileUpload';
import { KeyProduct } from '../../interface';
import { keyBodyUploadFile } from '../../constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ModalImportFile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
  const { dispatch: dispatchAlert } = useStoreAlert();
  const {
    state: { isCreateBulkProduct },
    dispatch
  } = useStore();
  const {
    state: { organizations }
  } = useStoreOrg();
  const { dispatch: dispatchInvoice } = useStoreInvoice();

  const currentOrganization = Cookies.get('current_organizations');
  const currentLocalTime = dayjs().utc();

  const [file, setFile] = useState<File | null>(null);
  const [arrayFileXLSX, setArrayFileXLSX] = useState([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile) {
      const data = (await readFileAsync(selectedFile)) as never;
      convertDataXlsx(data);
      setFile(selectedFile);
    }
  };

  const convertDataXlsx = (data: Array<Array<string | number>>) => {
    const dataRemovedLineSpace = data?.filter((row) => row?.length > 0);

    const [header, ...rows] = dataRemovedLineSpace;

    const cleanedRows = rows.map((row: Array<string | number>) =>
      row.map((cell: string | number) => {
        if (cell === '-') {
          return null;
        }
        if (typeof cell === 'string') {
          return cell.trim();
        }
        return cell;
      })
    );

    const dataConverted = cleanedRows?.reduce(
      (acc: KeyProduct[], rowData: (string | number | null)[]) => {
        const [
          image,
          sku,
          unit_of_measure,
          available,
          upc,
          product_series,
          unit_cost,
          weight_unit,
          qty_on_hand,
          qty_pending,
          qty_reserve,
          description
        ] = rowData;

        const productEntry = acc?.find(
          (item) =>
            item['Image'] === image &&
            item['SKU'] === sku &&
            item['Unit of measure'] === unit_of_measure &&
            item['Available'] === available &&
            item['UPC'] === upc &&
            item['Product series'] === product_series &&
            item['Unit cost'] === unit_cost &&
            item['Weight unit'] === weight_unit &&
            item['On hand'] === qty_on_hand &&
            item['Pending'] === qty_pending &&
            item['Reserve'] === qty_reserve &&
            item['Description'] === description
        );

        if (!productEntry) {
          acc?.push({
            Image: image || '',
            SKU: sku || '',
            'Unit of measure': unit_of_measure || null,
            Available: available || null,
            UPC: upc || '',
            'Product series': product_series || null,
            'Unit cost': unit_cost || 0,
            'Weight unit': weight_unit || '',
            'On hand': qty_on_hand || 0,
            Pending: qty_pending || 0,
            Reserve: qty_reserve || 0,
            Description: description || ''
          } as never);
        }
        return acc;
      },
      []
    );

    setArrayFileXLSX(dataConverted as never);
  };

  const mappedData = useMemo(() => {
    return arrayFileXLSX?.map((item: KeyProduct) => {
      const mappedItem = mapKeys(item, keyBodyUploadFile);
      return mappedItem;
    }).filter((item) => Object.values(item).some((field) => !!field));
  }, [arrayFileXLSX]);

  const handleDeleteFile = () => {
    setFile(null);
    if (fileInput) {
      fileInput.value = '';
    }
    setArrayFileXLSX([]);
  };

  const handleGetInvoice = useCallback(async () => {
    try {
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipRequest());
      const res = await getInvoiceService();
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipSuccess());
      localStorage.setItem('product', 'create_product');
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

  const handleCancel = () => {
    onClose();
    setFile(null);
    if (fileInput) {
      fileInput.value = '';
    }
    setArrayFileXLSX([]);
  };

  const handleImportFile = async () => {
    if (
      currentOrganization &&
      organizations[currentOrganization]?.qbo_refresh_token_exp_time &&
      dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
        .utc()
        .isAfter(currentLocalTime)
    ) {
      try {
        dispatch(actions.createBulkProductRequest());
        await services.createBulkProductService(mappedData);
        dispatch(actions.createBulkProductSuccess());
        dispatchAlert(
          openAlertMessage({
            message: 'Create Bulk Product Successfully',
            color: 'success',
            title: 'Success'
          })
        );
        handleCancel();
      } catch (error: any) {
        dispatch(actions.createBulkProductFailure(error.message));
        try {
          dispatchAlert(
            openAlertMessage({
              message: error.message || 'Create Bulk Product Fail',
              color: 'error',
              title: 'Fail'
            })
          );
        } catch (e) {
          dispatchAlert(
            openAlertMessage({
              message: 'Create Bulk Product Fail',
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

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pb-4">
        <div className="flex items-center pb-2">
          <ImportIcon />
          <h3 className="ml-2 text-lg font-semibold">Import Product</h3>
        </div>
        <p className="text-sm font-normal text-santaGrey">
          Upload a XLSX to import Product Data to system
        </p>
      </div>
      <FileUpload onChange={handleFileChange} accept=".xlsx" />
      {file && (
        <>
          <div className="my-4 flex items-center justify-between rounded-lg border border-transparent bg-neutralLight p-2 text-lightPrimary dark:bg-gunmetal dark:text-white">
            <div className="flex items-center">
              <DocIcon />
              <p className="ml-2">{file?.name}</p>
            </div>
            <div className="cursor-pointer" onClick={handleDeleteFile}>
              <DeleteIcon />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              onClick={handleCancel}
              disabled={isCreateBulkProduct}
              color="dark:bg-gunmetal bg-buttonLight"
              className="mr-2 flex justify-center"
            >
              Cancel
            </Button>
            <Button
              isLoading={isCreateBulkProduct}
              disabled={isCreateBulkProduct}
              className="flex justify-center bg-dodgerBlue"
              onClick={handleImportFile}
            >
              Import File
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
