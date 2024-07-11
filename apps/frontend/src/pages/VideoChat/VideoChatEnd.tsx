import { useEffect, useState, type FC } from 'react';
import { Button, Icon } from '../../components/UI';
import { cn } from '../../utils/cn';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { useAppDispatch } from '../../app/hooks';
import { patchDoctorData } from '../../app/doctor/DoctorThunks';
import { type IDoctor } from '../../dataTypes/Doctor';
import { changeAppointmentStatus } from '../../app/appointment/AppointmentThunks';
import { AppointmentStatus } from '../../dataTypes/Appointment';

const VideoChatEnd = () => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { state } = useLocation();
  const doctor = state?.doctor?.data as IDoctor;
  const { conferenceId } = useParams();
  if (!doctor || !conferenceId) return <Navigate to='/dashboard' replace />;

  const handleConfirmClick = () => {
    navigate('/dashboard', { replace: true });

    dispatch(
      patchDoctorData({
        id: doctor.id,
        data: {
          rating: selectedRating,
        },
      }),
    );
  };

  useEffect(() => {
    return () => {
      dispatch(
        changeAppointmentStatus({
          id: conferenceId,
          status: AppointmentStatus.COMPLETED,
        }),
      );
    };
  });

  return (
    <div className='flex h-svh w-svw items-center justify-center'>
      <div className='max-w-[550px] space-y-9'>
        <div>
          <h3 className='pb-3'>
            Your appointment with Dr. {doctor.firstName} {doctor.lastName} ended
          </h3>
          <p>You’ll find all the files from this appointment in ‘Appointment’ tab. You’ll receive your invoice soon</p>
        </div>
        <div className='flex flex-col items-center justify-center bg-background py-10'>
          <h3 className='pb-3'>Please, rate your appointment</h3>
          <StarsRating onClick={setSelectedRating} rating={selectedRating} />
        </div>
        <div className='flex items-center justify-end gap-4'>
          <Button onClick={() => navigate('/dashboard', { replace: true })} type='secondary'>
            Go to Dashboard
          </Button>
          <Button onClick={handleConfirmClick} disabled={selectedRating == 0} type='primary'>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

const StarsRating: FC<{ onClick: (rating: number) => void; rating: number }> = ({ onClick, rating }) => {
  const handleStarClick = (rating: number) => {
    onClick(rating);
  };

  return (
    <div className='flex gap-2'>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} onClick={() => handleStarClick(rating == i + 1 ? 0 : i + 1)}>
          <Icon
            variant={'star'}
            className={cn('h-14 w-14 stroke-main stroke-[0.5px]', i < rating ? 'text-main' : 'text-white')}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoChatEnd;
