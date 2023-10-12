import { ChangeEvent, useState } from 'react';

import ImportIcon from 'public/import-icon.svg';
import DeleteIcon from 'public/delete.svg';
import DocIcon from 'public/doc-icon.svg';
import { Modal } from '@/components/ui/Modal';
import { readFileAsync } from '@/utils/utils';
import { Button } from '@/components/ui/Button';
import FileUpload from '@/app/(withHeader)/product-aliases/components/FileUpload';

export default function ModalImportFile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileInput = document.getElementById('file-upload') as HTMLInputElement;

  const [file, setFile] = useState<File | null>(null);
  const [arrayFileXLSX, setArrayFileXLSX] = useState([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile) {
      const data = (await readFileAsync(selectedFile)) as never;
      setFile(selectedFile);
    }
  };

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

  const handleImportFile = async () => {};

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
              // disabled={isLoadingCreateBulkProductAlias}
              color="dark:bg-gunmetal bg-buttonLight"
              className="mr-2 flex justify-center"
            >
              Cancel
            </Button>
            <Button
              // isLoading={isLoadingCreateBulkProductAlias}
              // disabled={isLoadingCreateBulkProductAlias}
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
