import { useState } from 'react';

type IDataArray = {
  [key: string]: string | number | object;
};

const useSelectTable = ({ data }: { data: IDataArray[] }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const onSelectAll = () => {
    if (data?.length === selectedItems.length) {
      setSelectedItems([]);
    } else {
      const all = data?.map((item: any) => item.id);
      setSelectedItems(all);
    }
  };

  const onSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item: number) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return {
    selectedItems,
    onSelectAll,
    onSelectItem
  };
};

export default useSelectTable;
