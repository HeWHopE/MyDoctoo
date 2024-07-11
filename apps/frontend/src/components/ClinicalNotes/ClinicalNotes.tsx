import { Button, Icon, Spinner } from '../UI';
import ImgAvatarKey from '../UI/ImgAvatarKey/ImgAvatarKey';
import { Summary } from './Summary';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getAppointment, updateAppointmentNotes } from '../../app/appointment/AppointmentThunks';
import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { cn } from '../../utils/cn';
import { SummaryPDF } from './SummaryPDF';
import { TextAreaWithHighlight } from '../UI/TextAreaWithHighlight/TextAreaWithHighlight';
import type { TPatient } from '../../dataTypes/Patient';
import { resetError } from '../../app/appointment/AppointmentSlice';

type ClinicalNotesProps = {
  appointmentId: string;
  className?: string;
};

export const ClinicalNotes = ({ appointmentId, className }: ClinicalNotesProps) => {
  const dispatch = useAppDispatch();
  const appointment = useAppSelector(state => state.appointment.appointment);
  const isLoading = useAppSelector(state => state.appointment.isLoading);
  const error = useAppSelector(state => state.appointment.error);

  if (error) setTimeout(() => dispatch(resetError()), 10_000);

  const [notes, setNotes] = useState('');

  const onClickSummarize = () => {
    dispatch(updateAppointmentNotes({ appointmentId, notes: notes }));
  };

  const recognizedWords = [];
  if (appointment?.notesSummary?.complaints.length)
    recognizedWords.push(...appointment.notesSummary.complaints.map(complaint => complaint.name));
  if (appointment?.notesSummary?.problematicBodyParts.length)
    recognizedWords.push(...appointment.notesSummary.problematicBodyParts.map(bodyPart => bodyPart.name));
  useEffect(() => {
    dispatch(getAppointment(appointmentId));
  }, []);

  useEffect(() => {
    if (appointment?.notes) setNotes(appointment.notes);
  }, [appointment]);

  return (
    <div className={cn('h-fit space-y-6 bg-background px-6 py-5', className)}>
      <Header patient={appointment?.patient} appointmentType={(appointment as any)?.type} />
      <div className='w-full'>
        <p className='text-base font-normal text-grey-2'>Clinical note</p>
        <TextAreaWithHighlight
          onChange={e => setNotes(e.target.value)}
          text={notes}
          wordsToBeHighlighted={recognizedWords}
        />
      </div>
      <Button type='primary' className='w-full' onClick={onClickSummarize} disabled={isLoading}>
        Summarize
      </Button>
      {error && (
        <p className='w-full text-center text-sm font-normal leading-[17px] text-error'>
          Something went wrong. Try again later
        </p>
      )}
      {isLoading && (
        <div className='flex w-full justify-center'>
          <div className='mt-[5vh]'>
            <Spinner size={50} color='#089BAB' />
          </div>
        </div>
      )}
      {!isLoading && appointment?.notesSummary && (
        <>
          <Summary summary={appointment.notesSummary} />
          <PDFDownloadLink
            document={<SummaryPDF appointment={appointment} />}
            fileName='summary.pdf'
            className='no-underline'
          >
            <Button type='secondary' className='mt-6 flex w-full items-center justify-center gap-2'>
              <Icon variant='download' className='size-6' /> Download PDF
            </Button>
          </PDFDownloadLink>
        </>
      )}
    </div>
  );
};

type HeaderProps = {
  patient?: TPatient;
  appointmentType?: string;
};

function Header({ patient, appointmentType }: HeaderProps) {
  return (
    <div className='flex gap-4'>
      <ImgAvatarKey avatarKey={patient?.avatarKey} className='w-12' />
      <div className='flex-col gap-1'>
        <h1 className='w-full text-base font-semibold'>
          {patient?.firstName} {patient?.lastName}
        </h1>
        {appointmentType ? (
          <p className='text-sm font-medium text-grey-1'>
            {appointmentType.charAt(0) + appointmentType.slice(1).toLowerCase()}
          </p>
        ) : undefined}
      </div>
    </div>
  );
}
