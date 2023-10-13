import { useState } from 'react';

export default function useTableSort() {
  const [sortingColumn, setSortingColumn] = useState<string | null>(null);
  const [isASCSort, setIsASCSort] = useState(true);

  const onSort = (column: string, isASC: boolean) => {
    setSortingColumn(column);
    setIsASCSort(isASC);
  }

  return {
    sortingColumn,
    isASCSort,
    onSort,
  };
}
