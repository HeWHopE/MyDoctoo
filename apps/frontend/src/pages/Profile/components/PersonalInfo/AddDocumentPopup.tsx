import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { patchPatientData, uploadIdentityCard } from '@/app/patient/PatientThunks';
import type { RootState } from '@/app/store';
import { Button, Icon, PopupDoctoo, Spinner } from '@/components/UI';
import Select from '@/components/UI/Select/Select';
import type { TPatient } from '@/dataTypes/Patient';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useRef, useState } from 'react';
import { type FieldValues, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { PatientIdentityCardPhoto } from '../../../../components/IdentityCardPhoto/PatientIdentityCardPhoto';

type AddDocumentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface IFormData {
  identityCardType: string;
}

const schema = Joi.object({
  identityCardType: Joi.string().required(),
});

const options = ['International passport', 'Driver license', 'ID card'];

export default function AddDocumentPopup({ isOpen, onClose }: AddDocumentPopupProps) {
  const methods = useForm({
    mode: 'onChange',
    resolver: joiResolver(schema),
  });

  const dispatch = useAppDispatch();

  const patient = useAppSelector((state: RootState) => state.patient.data);
  const photoURL =
    patient.identityCardKey !== '' ? `${import.meta.env.VITE_S3_BASE_URL}/${patient.identityCardKey}` : null;

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [fileError, setFileError] = useState<string | null>(null);

  const [isNext, setIsNext] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit } = methods;

  async function onSubmit(data: IFormData): Promise<void> {
    let identityCardKey: string = '';
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(file.type)) {
        setFileError('Only JPEG and PNG files are allowed');
        return;
      }

      const formData = new FormData();
      formData.append('file', file!);
      try {
        setIsLoading(true);

        const result = await dispatch(
          uploadIdentityCard({ formData: formData, identityCardType: data.identityCardType }),
        );

        const response = result.payload;

        identityCardKey = response.name;
        setIsLoading(false);
      } catch (e) {
        setFileError(`invalid: ${data.identityCardType}`);
        setIsLoading(false);

        return;
      }
      setIsLoading(false);
    }

    const identityCardData: Partial<TPatient> = { identityCardKey, ...data };

    await dispatch(patchPatientData({ body: identityCardData, id: patient.id }));

    onClose();
    setFile(null);
    setIsNext(false);
    setFileError(null);
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 1) return setFileError('Only one file is allowed');
    if (files[0].size > 4 * 1024 * 1024) return setFileError('File size should be less than 4 MB');
    setFile(files[0]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file?.size > 4 * 1024 * 1024) {
        return setFileError('File size should be less than 4 MB');
      }
      setFileError(null);
      setFile(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PopupDoctoo
      popupIsOpen={isOpen}
      closePopup={() => {
        onClose();
        setFile(null);
        setIsNext(false);
        setFileError(null);
      }}
      modalFullClassName='max-w-[508px]'
      modalBodyClassName=' relative z-20 flex h-full max-w-[412px] flex-col gap-7 rounded-xl bg-white'
    >
      <p className='text-xl font-medium text-black sm:text-2xl'>
        {' '}
        {patient.identityCardKey !== null ? ' Change document ' : 'Add a new document'}
      </p>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className='flex flex-col gap-8'>
          {!isNext && (
            <div>
              {patient.identityCardKey && <PatientIdentityCardPhoto photoURL={photoURL} />}
              <Select id='identityCardType' options={options} />
            </div>
          )}

          {isNext && (
            <>
              {!file && (
                <>
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className='flex flex-col items-center gap-[10px] rounded-lg border border-dashed border-grey-2 p-6'
                  >
                    <div className='text-grey-1'>Drag & drop files here</div>
                    <div className='text-grey-1'>or</div>
                    <Button btnType='button' type='secondary' className='w-fit' onClick={handleButtonClick}>
                      Browse files
                    </Button>
                    <div className='text-grey-1'>files up to 4 MB, jpeg, png.</div>
                  </div>
                  {fileError && <p className='text-sm text-error'>{fileError}</p>}
                </>
              )}
              {file && (
                <div className='flex h-fit w-full flex-col items-center justify-center gap-4'>
                  <img src={URL.createObjectURL(file)} alt='Preview' className='max-h-64 max-w-xs' />
                  {fileError && <p className='text-sm text-error'>{fileError}</p>}
                  <button type='button' className='flex gap-3 text-main' onClick={handleButtonClick}>
                    <Icon variant='change' />
                    <span>Change photo</span>
                  </button>
                </div>
              )}
              <input
                type='file'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
                accept='.png, .jpg, .jpeg'
              />
            </>
          )}
          <div className='flex w-full gap-4'>
            <Button
              btnType='reset'
              className='w-1/2'
              type='secondary'
              onClick={() => {
                onClose();
                setIsNext(false);
              }}
            >
              Cancel
            </Button>
            {!isNext && (
              <Button btnType='button' className='w-1/2' onClick={() => setIsNext(!isNext)} type='primary'>
                Next
              </Button>
            )}
            {isNext && (
              <Button btnType='submit' className='flex w-1/2 items-center justify-center gap-4' type='primary'>
                {isLoading && <Spinner size={30} color='white' />} Save
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </PopupDoctoo>
  );
}
