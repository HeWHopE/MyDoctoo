import CropImagePopup from '@UI/CropImage/CropImagePopup';
import React, { useContext, useState } from 'react';

type CropImagePopupContextType = {
  isOpen: boolean;
  openPopup: (file: File | string) => void;
  closePopup: () => void;
  file?: File | string;
  setFile: React.Dispatch<React.SetStateAction<File | string | undefined>>;
  savedFile?: File;
  setSavedFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

export const CropImagePopupContext = React.createContext<CropImagePopupContextType | null>(null);

export const useCropImagePopup = () => {
  const context = useContext(CropImagePopupContext);

  if (!context) {
    throw new Error('useCropImagePopup must be used within a CropImagePopupProvider');
  }

  return context;
};

const CropImagePopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | string>();
  const [savedFile, setSavedFile] = useState<File>();

  const openPopup = (file: File | string) => {
    setFile(file);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <CropImagePopupContext.Provider value={{ isOpen, openPopup, closePopup, file, setFile, savedFile, setSavedFile }}>
      {children}
      <CropImagePopup
        isOpen={isOpen}
        closePopup={closePopup}
        file={file}
        saveFile={file => {
          setSavedFile(file);
        }}
      />
    </CropImagePopupContext.Provider>
  );
};

export default CropImagePopupProvider;
