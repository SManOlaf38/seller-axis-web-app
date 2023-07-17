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
      autoHideDuration={2000}
      color={content.color}
      title={content.title}
      description={content.message}
      onClose={handleCloseAlert}
      closeButton
      floating
    />
  );
};

export default AlertContainer;
