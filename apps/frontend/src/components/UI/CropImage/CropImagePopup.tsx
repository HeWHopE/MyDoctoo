import { useState, useCallback, useRef, useEffect } from 'react';
import type { Crop } from 'react-image-crop';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import PopupDoctoo from '../Popup/Popup';
import { Button } from '../Button/Button';

export type CropImageProps = {
  isOpen: boolean;
  closePopup: () => void;
  file?: File | string;
  saveFile(file: File): void;
};

const initialCrop: Crop = { unit: '%', width: 100, height: 100, x: 0, y: 0 };

export default function CropImagePopup({ file, isOpen, closePopup, saveFile }: CropImageProps) {
  const [upImg, setUpImg] = useState<string | ArrayBuffer | null>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>(initialCrop);
  const [cropedImageBlob, setCropedImageBlob] = useState<Blob>();
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!file) return;
    if (typeof file === 'string') {
      setUpImg(file);
    } else if (file instanceof File) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(file);
    }
  }, [file]);

  const onLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
    const min = Math.min(img.width, img.height);
    const width = (min / img.width) * 100 - 10;
    const height = (min / img.height) * 100 - 10;
    const x = ((img.width - min) / 2 / img.width) * 100 + 5;
    const y = ((img.height - min) / 2 / img.height) * 100 + 5;

    const crop: Crop = { unit: '%', width, height, x, y };
    setCrop(crop);
    makeClientCrop(crop);
  }, []);

  const makeClientCrop = async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      createCropPreview(imgRef.current, crop, 'newFile.jpeg');
    }
  };

  const createCropPreview = async (image: HTMLImageElement, crop: Crop, fileName: string): Promise<void> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width!,
      crop.height!,
    );

    return new Promise<void>((_, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        (blob as Blob & { name?: string }).name = fileName;
        window.URL.revokeObjectURL(previewUrl!);
        setPreviewUrl(window.URL.createObjectURL(blob));
        setCropedImageBlob(blob);

        const img = new Image();
        img.onload = function () {
          const _img = this as HTMLImageElement;
          console.log('onload', _img.width, _img.height);
        };
        img.src = window.URL.createObjectURL(blob);
      }, 'image/jpeg');
    });
  };

  const handleCancel = () => {
    closePopup();
    setCrop(initialCrop);
  };

  const handleCrop = () => {
    if (!cropedImageBlob) return;
    const cropedImage = new File([cropedImageBlob], (file as File)?.name || 'filename.jpg', { type: 'image/jpeg' });
    saveFile(cropedImage);
    closePopup();
    setCrop(initialCrop);
  };

  return (
    <PopupDoctoo popupIsOpen={isOpen} closePopup={closePopup} modalFullClassName='max-w-[700px]'>
      <div className='flex w-full flex-col items-center gap-4'>
        <div className='flex w-full items-center justify-center rounded-xl bg-background p-5'>
          <ReactCrop
            crop={crop}
            minWidth={60}
            aspect={1}
            onChange={newCrop => setCrop(newCrop)}
            onComplete={makeClientCrop}
          >
            <img
              ref={imgRef}
              className='h-96 w-auto'
              src={upImg as string}
              alt='Preview'
              onLoad={e => onLoad(e.currentTarget)}
            />
          </ReactCrop>
        </div>
        <div className='flex gap-2'>
          <Button type='warn' onClick={handleCancel}>
            Cancel
          </Button>
          <Button type='primary' onClick={handleCrop}>
            Crop
          </Button>
        </div>
      </div>
    </PopupDoctoo>
  );
}
