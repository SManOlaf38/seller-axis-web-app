'use client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';

import { headerTableChangeHistory } from '@/app/(withHeader)/organizations//constants';
import { useStore } from '@/app/(withHeader)/organizations//context';
import * as action from '@/app/(withHeader)/organizations//context/action';
import * as service from '@/app/(withHeader)/organizations//fetch';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Autocomplete from '@/components/ui/Autocomplete';
import { SubBar } from '@/components/common/SubBar';
import { Input } from '@/components/ui/Input';
import { TableScroll } from '@/components/ui/TableScroll';

import type { ChangeHistory } from '@/app/(withHeader)/organizations//interfaces';

const ChangeHistoryContainer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const paramsUrl = new URLSearchParams(searchParams);
  const {
    state: { isLoading, memberOrganization, isLoadMoreMember },
    dispatch
  } = useStore();
  const { onChangePerPage, setCurrentPage } = usePagination();
  const { search, debouncedSearchTerm, handleSearch } = useSearch('operation');
  const { page: pageMember, onPageChange: onPageChangeMember } = usePagination();

  //value is defined, i will remove when api is available
  const changeHistory = [] as any;

  const [filter, setFilter] = useState<{
    member: {
      label: string;
      value: string;
    } | null;
    date: string | null;
  }>({
    member: null,
    date: null
  });

  const renderBodyTable = changeHistory?.map((row: ChangeHistory) => ({
    id: row.id || '',
    date: row.created_at ? dayjs(row.created_at).format('MM/DD/YYYY') : '-',
    change_by: `${row?.user?.last_name || '-'} ${row?.user?.first_name || '-'}`,
    operation: row.operation || '-'
  }));

  const getMemberOrganization = async () => {
    try {
      dispatch(action.getMemberOrganizationRequest());
      const data = await service.getOrganizationMemberService({
        id: params?.id as string,
        page: 0,
        rowsPerPage: 10,
        search: debouncedSearchTerm || ''
      });
      dispatch(action.getMemberOrganizationSuccess(data));
    } catch (error: any) {
      dispatch(action.getMemberOrganizationFail(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleChangeFilter = (
    name: string,
    valueMember?: { label: string; value: string } | null,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter({
      ...filter,
      [name]: valueMember || (event ? event.target.value : null)
    });
  };

  const handleClearFilter = async () => {
    setFilter({
      member: null,
      date: null
    });
    paramsUrl.delete('member');
    paramsUrl.delete('date');
    router.push(`${pathname}?${paramsUrl}`);
  };

  const handleViewMoreRetailer = async () => {
    const currentPage = pageMember + 1;
    try {
      dispatch(action.getLoadMoreMemberRequest());
      const res = await service.getOrganizationMemberService({
        id: params?.id as string,
        search: debouncedSearchTerm || '',
        page: currentPage,
        rowsPerPage: 10
      });
      dispatch(action.getLoadMoreMemberSuccess(res));
      onPageChangeMember(currentPage + 1);
    } catch (error: any) {
      dispatch(action.getLoadMoreMemberFailure(error));
    }
  };

  const handleFilter = async () => {
    setCurrentPage(0);
    paramsUrl.set('member', filter?.member?.label || '');
    filter.date && paramsUrl.set('date', filter.date);
    router.push(`${pathname}?${paramsUrl}`);
  };

  useEffect(() => {
    params?.id && getMemberOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <Card>
      <SubBar
        setCurrentPage={setCurrentPage}
        search={search}
        onSearch={handleSearch}
        title={'Change History'}
        isActiveFilter
        filterContent={
          <div className="grid gap-2">
            <Autocomplete
              options={memberOrganization?.results?.map((item) => ({
                label: `${item.user.last_name} ${item.user.first_name}`,
                value: item.id
              }))}
              handleChangeText={handleSearch}
              addNew={false}
              label="Member"
              name="member"
              placeholder="Select Member"
              value={filter.member}
              onChange={(value: { label: string; value: string }) =>
                handleChangeFilter('member', value)
              }
              handleViewMore={handleViewMoreRetailer}
              isLoadMore={isLoadMoreMember}
              disableLodMore={memberOrganization?.next}
            />

            <Input
              value={filter.date || ''}
              placeholder="Enter date"
              type="date"
              onChange={(event) => handleChangeFilter('date', null, event as never)}
            />

            <div className="mt-2 grid w-full grid-cols-2 gap-2">
              <Button
                onClick={handleClearFilter}
                color="dark:bg-gunmetal bg-buttonLight"
                className="flex justify-center"
              >
                Clear
              </Button>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                onClick={handleFilter}
                className="flex justify-center bg-dodgerBlue"
              >
                Apply
              </Button>
            </div>
          </div>
        }
      />
      <TableScroll columns={headerTableChangeHistory} loading={isLoading} rows={renderBodyTable} />
    </Card>
  );
};

export default ChangeHistoryContainer;
