'use client'

import { IOrganizationDetail } from '../../interfaces';
import MainOrganization from '../components/MainOrganization';

const OrganizationContainer = ({ detail }: { detail: IOrganizationDetail | undefined }) => {
  return (
    <MainOrganization detail={detail} />
  )
}

export default OrganizationContainer