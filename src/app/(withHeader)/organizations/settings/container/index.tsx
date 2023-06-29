'use client';

import { OrganizationDetailType } from '../../interfaces';
import MainOrganization from '../components/MainOrganization';

const OrganizationContainer = ({
  detail,
}: {
  detail: OrganizationDetailType | undefined;
}) => {
  return <MainOrganization detail={detail} />;
};

export default OrganizationContainer;
