
import { useState } from 'react';

export default function usePagination() {
  const [page, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onPageChange = (value: string | number) => {
    setCurrentPage(Number(value) - 1);
  };

  return {
    page,
    rowsPerPage,
    onPageChange,
    setRowsPerPage
  };
}
