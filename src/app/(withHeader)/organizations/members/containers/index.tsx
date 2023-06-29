'use client';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';

import { SubBar } from '@/components/common/SubBar';
import { Table } from '@/components/ui/Table';
import useSearch from '@/hooks/useSearch';
import useToggleModal from '@/hooks/useToggleModal';
import { headerTable } from '../../contants';
import { useStore } from '../../context';
import * as action from '../../context/action';
import * as service from '../../fetch';
import type { InviteType } from '../../interfaces';
import { InviteMember } from '../components/InviteMemberModal';

const TestData = [
  {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
  {
    id: 2,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
  {
    id: 3,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
  {
    id: 4,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
  {
    id: 5,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
  {
    id: 6,
    name: 'John',
    email: 'john@example.com',
    role: 'Admin',
    created_at: new Date(),
  },
];

const MemberOrganizationContainer = ({ id }: { id: string }) => {
  const {
    state: { isLoading },
    dispatch,
  } = useStore();
  const { openModal, handleToggleModal } = useToggleModal();
  const { search, handleSearch } = useSearch();

  const renderBodyTable = TestData.map((row) => ({
    id: row.id || '',
    name: row.name || '',
    email: row.email || '',
    role: row.role || '',
    created_at: dayjs(row.created_at).format('YYYY-MM-DD') || '',
  }));

  const getOrganization = useCallback(async () => {
    try {
      dispatch(action.getMemberOrganizationRequest());
      const data = await service.getOrganizationMemberService(id);
      dispatch(action.getMemberOrganizationSuccess(data));
    } catch (error: any) {
      dispatch(action.getMemberOrganizationFail(error));
    }
  }, [dispatch, id]);

  const handleInviteMember = async (data: InviteType) => {
    try {
      dispatch(action.inviteMemberRequest());
      const newMember = await service.inviteMemberService(data);
      dispatch(action.inviteMemberSuccess(newMember));
    } catch (error: any) {
      dispatch(action.inviteMemberFail(error));
    }
  };

  useEffect(() => {
    getOrganization();
  }, [dispatch, getOrganization]);

  return (
    <div className="rounded-lg bg-darkGreen p-4">
      <div>
        <SubBar
          search={search}
          onSearch={handleSearch}
          onSearchModal={() => {}}
          title="List member"
          addTitle="Invite member"
          onSubmit={handleToggleModal}
        />
      </div>
      <div className="header_cus rounded-lg border">
        <Table
          columns={headerTable}
          loading={false}
          isSelect={false}
          rows={renderBodyTable}
          className="bg-darkGreen"
          totalCount={100}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={1}
          pageSize={100}
        />
      </div>
      <InviteMember
        isLoading={isLoading}
        onSubmitData={handleInviteMember}
        open={openModal}
        onModalMenuToggle={handleToggleModal}
      />
    </div>
  );
};

export default MemberOrganizationContainer;
