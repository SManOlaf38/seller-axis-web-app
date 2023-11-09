import { useState } from 'react';

type IDataArray = {
  [key: string]: string | number | object | null | boolean | unknown;
};

const useSelectTable = ({ data }: { data: IDataArray[] }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedItemObjects, setSelectedItemObjects] = useState([]);

  const onSelectAll = () => {
    if (data?.length === selectedItems?.length) {
      setSelectedItems([]);
      setSelectedItemObjects([]);
    } else {
      const all = data?.map((item: any) => item.id);
      const selectedItemsData = data?.filter((item) => all?.includes(item?.id)) as never;
      setSelectedItems(all);
      setSelectedItemObjects(selectedItemsData || []);
    }
  };

  const onSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      const updatedItems = selectedItems?.filter((item: number) => item !== id);
      const updatedObjects = selectedItemObjects?.filter((item: { id: number }) => item?.id !== id);
      setSelectedItems(updatedItems);
      setSelectedItemObjects(updatedObjects);
    } else {
      const selectedItem = data?.find((item) => item?.id === id) as never;
      if (selectedItem) {
        setSelectedItems([...selectedItems, id]);
        setSelectedItemObjects([...selectedItemObjects, selectedItem]);
      }
    }
  };

  return {
    selectedItems,
    selectedItemObjects,
    onSelectAll,
    onSelectItem,
    setSelectedItems
  };
};

export default useSelectTable;
