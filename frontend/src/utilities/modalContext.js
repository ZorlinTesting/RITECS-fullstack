import React, { createContext, useState, useContext, useEffect } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);
export const ModalProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);

  const openLoginModal = () => {
    console.log("Opening modal"); // Debug log
    setShowLogin(true);
    console.log(showLogin);
  };
  const closeLoginModal = () => setShowLogin(false);

  useEffect(() => {
    console.log("Modal should be showing:", showLogin);
}, [showLogin]);

  return (
    <ModalContext.Provider
      value={{ showLogin, openLoginModal, closeLoginModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
