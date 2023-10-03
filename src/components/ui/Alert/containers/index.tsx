'use client';

import Alert from '..';
import { useStore } from '../context';
import { closeAlertMessage } from '../context/action';

const AlertContainer = () => {
  const {
    state: { isOpen, content },
    dispatch
  } = useStore();

  const handleCloseAlert = () => {
    dispatch(closeAlertMessage());
  };

  return (
    <Alert
      open={isOpen}
      autoHideDuration={content?.customTimeHide || 2000}
      placement={
        content?.placement || {
          horizontal: 'right',
          vertical: 'bottom'
        }
      }
      action={content?.action}
      color={content.color}
      title={content.title}
      description={content.message}
      onClose={handleCloseAlert}
      closeButton
      floating
      zIndex={51}
    />
  );
};

export default AlertContainer;
