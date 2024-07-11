import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { deleteProfilePatientPhoto, patchUserData, uploadProfilePatientPhoto } from '@/app/patient/PatientThunks';
import { OptionToChangeProfilePhoto } from '@/components/ProfilePhoto/OptionToChangeProfilePhoto';
import { PatientProfilePhoto } from '@/components/ProfilePhoto/PatientProfilePhoto';
import { Button } from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import PopupDoctoo from '@/components/UI/Popup/Popup';
import type { TUser } from '@/dataTypes/User';
import { useCropImagePopup } from '@/hooks/popups/useCropImagePopup';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, type FieldValues, type SubmitHandler } from 'react-hook-form';

type PersonalInfoPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface IFormData {
  fullname: string;
  email: string;
  countryIndex: string;
  phone: string;
}

const schema = Joi.object({
  fullname: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email({ tlds: false }).optional(),
  countryIndex: Joi.string().optional(),
  phone: Joi.string().optional(),
});

const PersonalInfoPopup = ({ isOpen, onClose }: PersonalInfoPopupProps) => {
  const dispatch = useAppDispatch();
  const patient = useAppSelector(state => state.patient.data);
  const [file, setFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(
    patient.avatarKey !== '' ? `${import.meta.env.VITE_S3_BASE_URL}/${patient.avatarKey}` : null,
  );

  const { openPopup, savedFile, setFile: setImageFile, setSavedFile } = useCropImagePopup();
  setImageFile(`${import.meta.env.VITE_S3_BASE_URL}/${patient.avatarKey}`); // to fix bug with background mask when cropping

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    openPopup(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (savedFile) {
      setPhotoURL(URL.createObjectURL(savedFile));
      setFile(savedFile);
      setSavedFile(undefined);
    }
  }, [savedFile]);

  const handleDeletePhoto = () => {
    setPhotoURL(null);
    setFile(null);
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: joiResolver(schema),
  });

  const { handleSubmit } = methods;

  async function onSubmit(data: IFormData): Promise<void> {
    const [firstName, lastName] = data.fullname.split(' ');
    const { email } = data;

    let avatarKey: string = patient.avatarKey;

    if (file) {
      const formData = new FormData();
      formData.append('file', file!);

      if (avatarKey) {
        await dispatch(deleteProfilePatientPhoto(avatarKey));
      }

      const result = await dispatch(uploadProfilePatientPhoto(formData));
      const response = result.payload;

      avatarKey = response.name;
    }

    if (!file && !photoURL) {
      await dispatch(deleteProfilePatientPhoto(avatarKey));
      avatarKey = '';
    }

    const userData: Partial<TUser> = { email, phone: data.phone, firstName, lastName, avatarKey };

    dispatch(patchUserData({ userId: patient.userId, data: userData, patientId: patient.id }));

    setFile(null);

    onClose();
  }

  return (
    <PopupDoctoo
      popupIsOpen={isOpen}
      closePopup={onClose}
      modalFullClassName='max-w-[508px]'
      modalBodyClassName='relative z-20 flex h-full max-w-[412px] flex-col gap-6 sm:gap-7 rounded-xl bg-white'
    >
      <p className='text-xl font-medium text-black sm:text-2xl'>Personal info</p>
      <div className='flex flex-col items-center gap-2 sm:flex-row sm:gap-6'>
        <PatientProfilePhoto photoURL={photoURL} />
        <OptionToChangeProfilePhoto
          photoURL={photoURL}
          handleFileChange={handleFileChange}
          handleDeletePhoto={handleDeletePhoto}
        />
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className='flex w-full flex-col gap-7'>
          <div className='grid w-full  gap-2 sm:gap-6'>
            <Input
              id='fullname'
              label='Name and surname'
              defaultValue={`${patient.firstName} ${patient.lastName}`}
              type='text'
              className='w-full'
            />

            <div className='flex flex-col gap-1'>
              <Input id='email' label='Email' defaultValue={patient.email} type='text' className='w-full' />
              <p className='text-xs italic text-grey-1'>A confirmation list will be sent to your old email address</p>
            </div>

            <Input id='phone' label='Phone' defaultValue={patient.phone} type='text' className='w-full' />
          </div>

          <div className='flex w-full flex-col-reverse gap-4 sm:flex-row'>
            <Button btnType='reset' type='secondary' onClick={() => onClose()} className='w-full sm:w-1/2'>
              Cancel
            </Button>

            <Button btnType='submit' type='primary' className='w-full sm:w-1/2'>
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </PopupDoctoo>
  );
};

export default PersonalInfoPopup;
