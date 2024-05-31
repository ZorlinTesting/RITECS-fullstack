import React, { createContext, useState, useEffect, useContext } from 'react';
import useFetchImageData from '../hooks/useFetchImageData';

export const ImagesContext = createContext({
  images: [], // Initialize images as an empty array to gracefully handle find method
  setImages: () => {},
});

export const ImagesProvider = ({ children }) => {
    const { data, loading, error } = useFetchImageData();

  return (
    <ImagesContext.Provider value={{ images: data, loading, error }}>
      {children}
    </ImagesContext.Provider>
  );
};

// Custom hook for easy access to context
export const useImage = () => useContext(ImagesContext);