import { ChangeEvent, useState } from 'react';

import ImportIcon from 'public/import-icon.svg';
import DeleteIcon from 'public/delete.svg';
import DocIcon from 'public/doc-icon.svg';
import FileUpload from '../FileUpload';
import { Modal } from '@/components/ui/Modal';
import { readFileAsync } from '@/utils/utils';
import { Button } from '@/components/ui/Button';

export default function ModalImportFile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [arrayFileXLSX, setArrayFileXLSX] = useState([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];

    if (selectedFile) {
      const data = (await readFileAsync(selectedFile)) as never;
      xlsxFileToArray(data);
      setFile(selectedFile);
    }
  };

  const xlsxFileToArray = (text: string) => {
    console.log('text', text);
    // const csvHeader = text?.slice(0, text.indexOf('\n'))?.trim();
    // const csvRows = text?.slice(text.indexOf('\n') + 1)?.split('\n');

    // const array = csvRows?.map((i) => {
    //   const values = i?.split(',');
    //   const obj: Record<string, string> = csvHeader?.split(',')?.reduce((object, header, index) => {
    //     object[header?.trim()] = values[index]?.trim()?.replace(/"/g, '');
    //     return object;
    //   }, {} as Record<string, string>);
    //   return obj;
    // }) as never;

    // setArrayFileCSV(arrayFileCSV?.concat(array || []));
  };

  const handleDeleteFile = (index: any) => {
    // const newFiles = [...file];
    // newFiles.splice(index, 1);
    // setFile(newFiles);
  };

  const handleCancel = () => {
    onClose();
    setFile(null);
  };

  const handleImportFile = () => {};

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pb-4">
        <div className="flex items-center pb-2">
          <ImportIcon />
          <h3 className="ml-2 text-lg font-semibold">Import Products</h3>
        </div>
        <p className="text-sm font-normal text-santaGrey">
          Upload a XLSX to import Products Data to system
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
            <div className="cursor-pointer" onClick={() => handleDeleteFile(file)}>
              <DeleteIcon />
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              onClick={handleCancel}
              color="dark:bg-gunmetal bg-buttonLight"
              className="mr-2 flex justify-center"
            >
              Cancel
            </Button>
            <Button className="flex justify-center bg-dodgerBlue" onClick={handleImportFile}>
              Import File
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
