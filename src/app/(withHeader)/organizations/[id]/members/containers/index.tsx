'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';

import { SubBar } from '@/components/common/SubBar';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useToggleModal from '@/hooks/useToggleModal';
import { headerTable } from '../../../constants';
import { useStore } from '../../../context';
import * as action from '../../../context/action';
import * as service from '../../../fetch';
import { InviteMember } from '../components/InviteMemberModal';
import type { InviteType, OrganizationMemberType } from '../../../interfaces';

const MemberOrganizationContainer = ({ id }: { id: string }) => {
  const {
    state: { isLoading, memberOrganization, roles },
    dispatch
  } = useStore();

  const { openModal, handleToggleModal } = useToggleModal();
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const renderBodyTable = memberOrganization.results.map((row: OrganizationMemberType) => ({
    id: row.id || '',
    name: `${row.user.last_name} ${row.user.first_name}` || '',
    email: row.user.email || '',
    role: row.role.name || '',
    created_at: dayjs(row.created_at).format('YYYY-MM-DD') || ''
  }));

  const getMemberOrganization = useCallback(async () => {
    try {
      dispatch(action.getMemberOrganizationRequest());
      const data = await service.getOrganizationMemberService({
        id,
        page,
        search: debouncedSearchTerm,
        rowsPerPage
      });
      dispatch(action.getMemberOrganizationSuccess(data));
    } catch (error: any) {
      dispatch(action.getMemberOrganizationFail(error));
    }
  }, [id, debouncedSearchTerm, dispatch, page, rowsPerPage]);

  const getRole = useCallback(async () => {
    try {
      dispatch(action.getRoleRequest());
      const data = await service.getRolesService();
      dispatch(action.getRoleSuccess(data.results));
    } catch (error: any) {
      dispatch(action.getRoleFail(error));
    }
  }, [dispatch]);

  const handleInviteMember = async (data: InviteType) => {
    try {
      dispatch(action.inviteMemberRequest());
      const newMember = await service.inviteMemberService({
        ...data,
        role: +data.role?.value
      });
      data.callback && data.callback();
      dispatch(action.inviteMemberSuccess(newMember));
    } catch (error: any) {
      dispatch(action.inviteMemberFail(error));
    }
  };

  useEffect(() => {
    getMemberOrganization();
    getRole();
  }, [getMemberOrganization, getRole]);

  return (
    <Card>
      <SubBar
        search={search}
        onSearch={handleSearch}
        onSearchModal={() => {}}
        title="List member"
        addTitle="Invite member"
        onSubmit={handleToggleModal}
      />
      <Table
        columns={headerTable}
        loading={isLoading}
        rows={renderBodyTable}
        totalCount={memberOrganization?.count}
        siblingCount={1}
        onPageChange={onPageChange}
        currentPage={page}
        pageSize={rowsPerPage}
        isPagination
      />
      <InviteMember
        isLoading={isLoading}
        onSubmitData={handleInviteMember}
        open={openModal}
        onModalMenuToggle={handleToggleModal}
        roles={roles}
      />
    </Card>
  );
};

export default MemberOrganizationContainer;
