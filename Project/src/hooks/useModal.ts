// useModal.js
import { useState } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
  };
};


export const useUserModal = (initialState = false) => {
    const [isUserOpen, setIsUserOpen] = useState(initialState);
  
    const openUserModal = () => {
      setIsUserOpen(true);
    };
  
    const closeUserModal = () => {
      setIsUserOpen(false);
    };
  
    return {
      isUserOpen,
      openUserModal,
      closeUserModal,
    };
  };
  

  
export const useModalStays = (initialState = false) => {
  const [isOpenStays, setIsOpenStays] = useState(initialState);

  const openModalStays = () => {
    setIsOpenStays(true);
  };

  const closeModalStays = () => {
    setIsOpenStays(false);
  };

  return {
    isOpenStays,
    openModalStays,
    closeModalStays,
  };
};

