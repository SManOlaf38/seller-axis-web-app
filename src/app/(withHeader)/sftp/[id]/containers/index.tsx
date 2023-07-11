import NewSFTPContainer from '../../create/containers';
import { SFTP } from '../../interface';

const SFTPDetailContainer = ({ detail }: { detail: SFTP }) => {
  return <NewSFTPContainer detail={detail} />;
};

export default SFTPDetailContainer;
