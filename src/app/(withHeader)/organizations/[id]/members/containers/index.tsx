'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { headerTable } from '@/app/(withHeader)/organizations//constants';
import { useStore } from '@/app/(withHeader)/organizations//context';
import * as action from '@/app/(withHeader)/organizations//context/action';
import * as service from '@/app/(withHeader)/organizations//fetch';
import type {
  InviteType,
  OrganizationMemberType
} from '@/app/(withHeader)/organizations//interfaces';
import { SubBar } from '@/components/common/SubBar';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useToggleModal from '@/hooks/useToggleModal';
import { InviteMember } from '../components/InviteMemberModal';
import { Button } from '@/components/ui/Button';
import DeleteIcon from 'public/delete.svg';
import DetailIcon from 'public/detail.svg';
import ActionIcon from 'public/three-dot.svg';

const MemberOrganizationContainer = ({ id }: { id: string }) => {
  const {
    state: { isLoading, memberOrganization, roles, errorMessage },
    dispatch
  } = useStore();

  const { openModal, handleToggleModal } = useToggleModal();
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const [detailMember, setDetailMember] = useState<OrganizationMemberType>();

  const renderBodyTable = memberOrganization.results.map((row: OrganizationMemberType) => ({
    id: row.id || '',
    name: `${row.user.last_name} ${row.user.first_name}` || '',
    email: row.user.email || '',
    role: row.role.name || '',
    created_at: dayjs(row.created_at).format('YYYY-MM-DD') || '',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute">
          <Dropdown mainMenu={<ActionIcon />} className="w-[110px]">
            <div className="rounded-lg ">
              <Button
                onClick={() => {
                  setDetailMember(row);
                  handleToggleModal();
                }}
                className="!text-lightPrimary dark:!text-gey100"
              >
                <DetailIcon />
                Detail
              </Button>
            </div>
            <div className="rounded-lg">
              <Button
                onClick={() => handleDeleteMember(row.id)}
                className="!text-lightPrimary dark:!text-gey100"
              >
                <DeleteIcon /> Delete
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
    )
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
        id,
        role: data.role?.value
      });
      data.callback && data.callback();
      getMemberOrganization();
      dispatch(action.inviteMemberSuccess(newMember));
    } catch (error: any) {
      dispatch(action.inviteMemberFail(error.message));
    }
  };

  const handleUpdateInviteMember = async (data: InviteType) => {
    try {
      dispatch(action.updateInviteMemberRequest());
      await service.updateInviteMemberService({
        orgId: +id,
        id: detailMember?.id && +detailMember?.id,
        role: +data.role?.value
      });
      data.callback && data.callback();
      getMemberOrganization();
      dispatch(action.updateInviteMemberSuccess());
    } catch (error: any) {
      dispatch(action.updateInviteMemberFail(error.message));
    }
  };

  const handleDeleteMember = async (idMember: number) => {
    try {
      dispatch(action.deleteMemberRequest());
      await service.deleteMemberService({
        orgId: +id,
        id: idMember
      });
      getMemberOrganization();
      dispatch(action.deleteMemberSuccess());
    } catch (error: any) {
      dispatch(action.deleteMemberFail(error.message));
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
        currentPage={page + 1}
        pageSize={rowsPerPage}
        isPagination
      />
      <InviteMember
        detailMember={detailMember}
        isLoading={isLoading}
        onSubmitData={detailMember?.id ? handleUpdateInviteMember : handleInviteMember}
        open={openModal}
        onModalMenuToggle={handleToggleModal}
        roles={roles}
        errorMessage={errorMessage}
      />
    </Card>
  );
};

export default MemberOrganizationContainer;
