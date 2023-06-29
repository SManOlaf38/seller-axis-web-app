import { useState } from 'react';
import useDebounce from './useDebounce';

const useSearch = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const debouncedSearchTerm = useDebounce(search, 500);

  return {
    search,
    debouncedSearchTerm,
    handleSearch,
    setSearch,
  };
};

export default useSearch;
