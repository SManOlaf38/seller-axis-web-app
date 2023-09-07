'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { OrganizationKeyType } from '@/app/(withHeader)/organizations/interfaces';
import DeleteOrganizationModal from '@/app/(withHeader)/organizations/[id]/members/components/DeleteOrganizationModal';
import { deleteOrganizationService } from '@/app/(withHeader)/organizations/fetch';
import * as service from '@/app/(withHeader)/organizations/fetch';
import * as action from '@/app/(withHeader)/organizations/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/organizations/context';
import { listMenu } from '@/app/(withHeader)/organizations/constants';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import PlusIcon from 'public/plus.svg';
import useToggleModal from '@/hooks/useToggleModal';
import fetchClient from '@/utils/fetchClient';

const NavOrganization = () => {
  const {
    state: { organizations, organizationIds, isLoading },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { openModal, handleToggleModal } = useToggleModal();

  const getOrganizations = async () => {
    const httpFetchClient = new fetchClient();
    try {
      dispatch(action.getOrganizationRequest());
      const data = await service.getOrganizationsService();

      const convertData = data.results.reduce(
        (
          obj: { organizationsTypeIds: number[]; organizationsTypes: OrganizationKeyType },
          item: { id: number }
        ) => {
          obj.organizationsTypes = { ...obj.organizationsTypes, [item.id]: item };
          obj.organizationsTypeIds.push(item.id);
          return obj;
        },
        {
          organizationsTypeIds: [],
          organizationsTypes: {}
        }
      );

      dispatch(action.getOrganizationSuccess(convertData));
      Cookies.set('current_organizations', data?.results[0]?.id);
      httpFetchClient.setHeader('organization', data?.results[0]?.id);
    } catch (error: any) {
      dispatch(action.getOrganizationFail(error?.message));
    }
  };

  const openModalDeleteOrganization = () => {
    if (organizationIds.length > 1) {
      handleToggleModal();
    } else {
      dispatchAlert(
        openAlertMessage({
          message:
            'Cannot delete the only organization. Add another organization to proceed with deletion',
          color: 'warning',
          title: 'Warning'
        })
      );
    }
  };

  const handleOrganizationDelete = async () => {
    try {
      dispatch(action.deleteOrganizationRequest());
      await deleteOrganizationService(+params?.id);
      dispatch(action.deleteOrganizationSuccess());
      Cookies.remove('current_organizations');
      getOrganizations();
      router.push('/');
      dispatchAlert(
        openAlertMessage({
          message: 'Organization deleted successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(action.deleteOrganizationFail(error?.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Organization Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  return (
    <Card className="px-[16px] py-[8px]">
      <div className="borer flex w-full items-center justify-between border-b border-iridium pb-[23px] pt-[18px]">
        <Dropdown
          className="left-0 mt-1 w-[250px] p-2 dark:bg-gunmetal"
          mainMenu={
            <div className="flex w-full justify-between">
              <div className="flex items-center">
                <Image
                  src={
                    organizations[+params?.id]?.avatar
                      ? organizations[+params?.id]?.avatar
                      : '/userAccount.svg'
                  }
                  width={40}
                  height={40}
                  priority
                  alt="Picture of the author"
                />
                <div className="ml-[12px] inline-block max-w-[45px] items-start lg:min-w-[145px]">
                  <p className="truncate text-left text-base font-semibold text-dodgerBlue">
                    {organizations[params?.id.toString()]?.name}
                  </p>
                  <p className="truncate text-left text-sm font-normal text-lightGray">Admin</p>
                </div>
              </div>
              <Image src="/down.svg" width={15} height={15} priority alt="Picture of the author" />
            </div>
          }
        >
          <div>
            <h3 className="px-2">Organizations</h3>
            <div>
              {organizationIds?.map((item: number) => (
                <div className="flex w-full items-center p-2" key={item}>
                  <div className="flex w-full items-center">
                    <Image
                      src="/userAccount.svg"
                      width={15}
                      height={15}
                      priority
                      alt="Picture of the author"
                    />
                    <div className="ml-2">{organizations[item].name}</div>
                  </div>
                  {organizations[item].id?.toString() === params?.id && (
                    <Image
                      src="/check.svg"
                      width={15}
                      height={15}
                      priority
                      alt="Picture of the author"
                    />
                  )}
                </div>
              ))}

              <Link href={`/organization/create`} className="flex w-full items-center p-2">
                <PlusIcon />

                <span className="ml-2"> Create Organization</span>
              </Link>
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="mt-[16px] flex flex-col">
        {listMenu(params.id.toString()).map(({ name, url }) => (
          <Link
            className={clsx(
              'text-primary-500 mb-[8px] flex h-[40px] items-center  px-[16px] text-[14px] font-[500] last:mb-0 dark:text-gey100',
              {
                ['rounded-md bg-neutralLight dark:bg-gunmetal']: pathname === url
              }
            )}
            href={url}
            key={name}
          >
            {name}
          </Link>
        ))}
        <p
          className="flex h-[40px] cursor-pointer items-center px-4 text-sm font-medium text-red"
          onClick={openModalDeleteOrganization}
        >
          Delete Organization
        </p>
      </div>
      <DeleteOrganizationModal
        open={openModal}
        onModalToggle={handleToggleModal}
        handleOrganizationDelete={handleOrganizationDelete}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default NavOrganization;
