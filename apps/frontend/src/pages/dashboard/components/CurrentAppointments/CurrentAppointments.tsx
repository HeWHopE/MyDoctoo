import AppointmentCard from '../AppointmentCard/AppointmentCard';
import type { TAppointment } from '@/dataTypes/Appointment';
import { Role } from '../../../../dataTypes/User';

type CurrentAppointmentsProps = {
  appointments: TAppointment[];
};

export default function CurrentAppointments({ appointments }: CurrentAppointmentsProps) {
  return (
    <div className='h-min-[306px] flex flex-col gap-5 rounded-xl bg-white px-2 sm:p-6'>
      <h3 className='text-lg max-lg:text-base'>Current appointments</h3>
      {appointments.length > 0 ? (
        <div className='grid gap-3'>
          {appointments.map(currentAppointment => {
            const appointmentPatient = currentAppointment['patient'];
            return (
              <AppointmentCard
                appointment={currentAppointment}
                key={currentAppointment.id}
                withQuickNotes={true}
                user={{ data: appointmentPatient!, role: Role.PATIENT }}
                about={currentAppointment.notes}
              />
            );
          })}
        </div>
      ) : (
        <div className='flex flex-col items-center gap-6'>
          <p className='text-center font-normal leading-6'>Seems like you don’t have current appointments.</p>
        </div>
      )}
    </div>
  );
}
