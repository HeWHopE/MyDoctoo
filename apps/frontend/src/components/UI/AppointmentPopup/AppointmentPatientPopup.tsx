import { PopupBodyPatient, PopupDoctoo, PopupHeader } from '@UI/index';
import type { PopupDoctooProps } from '@UI/Popup/Popup';
import type { AppointmentStatus, TAppointment } from '@/dataTypes/Appointment';
import useWindowWide from '@/hooks/useWindowWide';
import AppointmentButtons from '@/pages/Appointments/Components/AppointmentsList/ItemButtons';
import AppointmentLinks from '@/pages/Appointments/Components/AppointmentsList/ItemLinks';

type AppointmentPatientPopupProps = { appointment: TAppointment | null } & Omit<PopupDoctooProps, 'children'>;

const AppointmentPatientPopup = ({ appointment, ...PopupDoctooProps }: AppointmentPatientPopupProps) => {
  const tabletWidth = useWindowWide(824);
  const mobileWidth = useWindowWide(500);

  if (!appointment) return;

  return (
    <>
      <PopupDoctoo {...PopupDoctooProps} modalFullClassName='max-w-[700px]'>
        <>
          <div className='flex flex-col justify-between gap-y-8'>
            <div className='flex flex-col gap-y-4'>
              <PopupHeader startTime={appointment.startedAt} status={appointment.status as AppointmentStatus} />
              {!!appointment.patient && (
                <PopupBodyPatient patient={appointment.patient} typeAppointment={appointment.type} />
              )}
            </div>

            {(appointment.videoRecordKey || appointment.notes) && (
              <div className={`flex items-center ${tabletWidth ? 'justify-between' : 'mt-2 gap-x-2'}`}>
                <span className={`font-normal text-grey-2 `}>Attached files:</span>

                <div className='self-end'>
                  <AppointmentLinks videoRecordKey={appointment.videoRecordKey} notes={appointment.notes} />
                </div>
              </div>
            )}

            <div className={`flex gap-x-4 ${mobileWidth ? 'self-end' : 'self-center'}`}>
              <AppointmentButtons
                componentName='popup'
                appointment={appointment}
                isDoctor={true}
                openBookModal={() => {}}
              />
            </div>
          </div>
        </>
      </PopupDoctoo>
    </>
  );
};

export default AppointmentPatientPopup;
