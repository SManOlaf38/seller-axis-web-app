import { ChangeEvent, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/product-aliases/context';
import * as actions from '@/app/(withHeader)/product-aliases/context/action';
import * as services from '@/app/(withHeader)/product-aliases/fetch/index';
import ImportIcon from 'public/import-icon.svg';
import DeleteIcon from 'public/delete.svg';
import DocIcon from 'public/doc-icon.svg';
import FileUpload from '../FileUpload';
import { Modal } from '@/components/ui/Modal';
import { compareArrays, formatDateFromExcel, mapKeys, readFileAsync } from '@/utils/utils';
import { Button } from '@/components/ui/Button';
import { headerProductAliasCSV, keyBodyUploadFile } from '@/constants';
import {
  BodyFileUpload,
  HeaderFileDownload,
  KeyProductAlias,
  KeyRetailerWarehouse
} from '../../interface';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import usePagination from '@/hooks/usePagination';

export default function ModalImportFile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;

  const {
    state: { isLoadingCreateBulkProductAlias },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { page, rowsPerPage } = usePagination();

  const [file, setFile] = useState<File | null>(null);
  const [arrayFileXLSX, setArrayFileXLSX] = useState([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile) {
      const data = (await readFileAsync(selectedFile)) as Array<Array<string | number>>;
      const dataRemovedLineSpace = data?.filter((row) => row?.length > 0);
      const [header] = dataRemovedLineSpace;

      const headerTemplate = headerProductAliasCSV?.map(
        (header: HeaderFileDownload) => header?.label
      );

      if (compareArrays(headerTemplate, header)) {
        convertDataXlsx(dataRemovedLineSpace);
        setFile(selectedFile);
      } else {
        dispatchAlert(
          openAlertMessage({
            message: 'Data in the file does not match the template. Please review and correct',
            color: 'warning',
            title: 'Warning'
          })
        );
        setFile(null);
        if (fileInput) {
          fileInput.value = '';
        }
      }
    }
  };

  const convertDataXlsx = (data: Array<Array<string | number>>) => {
    const [header, ...rows] = data;

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
      (acc: KeyProductAlias[], rowData: (string | number | null)[]) => {
        const [
          skuAlias,
          product,
          packageQuantity,
          merchantSKU,
          vendorSKU,
          retailer,
          retailerMerchantId,
          upc,
          retailerWarehouse,
          qtyOnHand,
          nextAvailableQty,
          nextAvailableDate
        ] = rowData;

        const productEntry = acc?.find(
          (item) =>
            item['Product'] === product &&
            item['SKU Alias'] === skuAlias &&
            item['Package Quantity'] === packageQuantity &&
            item['Merchant SKU'] === merchantSKU &&
            item['Vendor SKU'] === vendorSKU &&
            item['Retailer'] === retailer &&
            item['Merchant ID'] === retailerMerchantId &&
            item['UPC'] === upc
        );

        if (!productEntry) {
          acc?.push({
            'SKU Alias': skuAlias || null,
            Product: product || null,
            'Package Quantity': packageQuantity || null,
            'Merchant SKU': merchantSKU || null,
            'Vendor SKU': vendorSKU || null,
            Retailer: retailer || null,
            'Merchant ID': retailerMerchantId || null,
            UPC: upc || null,
            warehouse_array: [
              {
                'Retailer Warehouse': retailerWarehouse || null,
                'QTY On Hand': qtyOnHand || null,
                'Next Available QTY': nextAvailableQty || null,
                'Next Available Date': nextAvailableDate
                  ? formatDateFromExcel(nextAvailableDate as string)
                  : null
              }
            ]
          } as never);
        } else {
          productEntry['warehouse_array']?.push({
            'Retailer Warehouse': retailerWarehouse || null,
            'QTY On Hand': qtyOnHand || null,
            'Next Available QTY': nextAvailableQty || null,
            'Next Available Date': nextAvailableDate
              ? formatDateFromExcel(nextAvailableDate as string)
              : null
          });
        }

        return acc;
      },
      []
    );
    setArrayFileXLSX(dataConverted as never);
  };

  const mappedData = useMemo(() => {
    return arrayFileXLSX?.map((item: KeyProductAlias) => {
      const mappedItem = mapKeys(item, keyBodyUploadFile) as BodyFileUpload;

      if (item.warehouse_array) {
        mappedItem.warehouse_array = item.warehouse_array?.map((warehouse: KeyRetailerWarehouse) =>
          mapKeys(warehouse, keyBodyUploadFile)
        );
      }
      return mappedItem;
    });
  }, [arrayFileXLSX]);

  const handleDeleteFile = () => {
    setFile(null);
    if (fileInput) {
      fileInput.value = '';
    }
    setArrayFileXLSX([]);
  };

  const handleCancel = () => {
    onClose();
    setFile(null);
    if (fileInput) {
      fileInput.value = '';
    }
    setArrayFileXLSX([]);
  };

  const handleGetProductAlias = async () => {
    try {
      dispatch(actions.getProductAliasRequest());
      const dataProduct = await services.getProductAliasService({
        search: '',
        page,
        rowsPerPage,
        sortingColumn: 'created_at',
        isASCSort: false
      });
      dispatch(actions.getProductAliasSuccess(dataProduct));
    } catch (error) {
      dispatch(actions.getProductAliasFailure(error));
    }
  };

  const handleImportFile = async () => {
    const body = mappedData?.map((item) => ({
      ...item,
      warehouse_array: item.warehouse_array?.filter((warehouse) =>
        Object.values(warehouse).some((value) => value !== null)
      )
    }));
    try {
      dispatch(actions.createBulkProductAliasRequest());
      await services.createBulkProductAliasService(body as never);
      dispatch(actions.createBulkProductAliasSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Imported successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleGetProductAlias();
      handleCancel();
    } catch (error: any) {
      dispatch(actions.createBulkProductAliasFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Imported Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pb-4">
        <div className="flex items-center pb-2">
          <ImportIcon />
          <h3 className="ml-2 text-lg font-semibold">Import Product Alias</h3>
        </div>
        <p className="text-sm font-normal text-santaGrey">
          Upload a XLSX to import Product Alias Data to system
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
              disabled={isLoadingCreateBulkProductAlias}
              color="dark:bg-gunmetal bg-buttonLight"
              className="mr-2 flex justify-center"
            >
              Cancel
            </Button>
            <Button
              isLoading={isLoadingCreateBulkProductAlias}
              disabled={isLoadingCreateBulkProductAlias}
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
