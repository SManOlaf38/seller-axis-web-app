import { useState } from 'react';

const useToggleModal = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleToggleModal = () => {
    setOpenModal((pre) => !pre);
  };

  return {
    openModal,
    handleToggleModal,
  };
};

export default useToggleModal;
