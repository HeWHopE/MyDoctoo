import Icon from '../Icon/Icon';
import { useEffect } from 'react';
import Popup from 'reactjs-popup';

export type PopupDoctooProps = {
  popupIsOpen: boolean;
  closePopup: () => void;
  backdropClassName?: string;
  modalFullClassName?: string;
  modalBodyClassName?: string;
  modalCloseClassName?: string;
  children: React.ReactNode;
};

export default function PopupDoctoo({
  popupIsOpen,
  closePopup,
  modalBodyClassName,
  children,
  backdropClassName,
  modalFullClassName,
  modalCloseClassName,
}: PopupDoctooProps) {
  useEffect(() => {
    if (popupIsOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [popupIsOpen]);

  return (
    <Popup open={popupIsOpen} onClose={closePopup} closeOnDocumentClick={false}>
      <div className={`flex h-screen w-screen bg-black opacity-20 ${backdropClassName}`} onClick={closePopup}></div>

      <article
        className={`no-scrollbar min-h-2/4 absolute left-1/2 top-1/2 flex max-h-[90vh] w-11/12 -translate-x-1/2 -translate-y-1/2 transform flex-col overflow-y-auto overflow-x-hidden rounded-xl bg-white p-10 sm:w-3/4 sm:p-12 ${modalFullClassName}`}
      >
        {/* Close icon */}
        <div className={`-m-8 mb-2 self-end ${modalCloseClassName}`}>
          <Icon variant='close' onClick={closePopup} className='cursor-pointer  text-grey-1' />
        </div>

        {/* Body */}
        <div className={modalBodyClassName}>{children}</div>
      </article>
    </Popup>
  );
}
