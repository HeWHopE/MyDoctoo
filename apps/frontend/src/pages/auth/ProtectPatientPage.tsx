import React from 'react';
import { Outlet, useNavigate } from 'react-router';
import api from '../../app/api';
import { setDoctorDataUser } from '../../app/doctor/DoctorSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPatientData } from '../../app/patient/PatientSlice';
import { setUserData, setUserState } from '../../app/user/UserSlice';
import PatientDashboardSkeleton from '../dashboard/components/PatientDashboard/PatientDashboardSkeleton';
import { getMyDeclarations } from '../../app/declaration/DeclarationThunks';

export const ProtectRoute: React.FC<{ Page?: React.ElementType }> = ({ Page }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isFetched = useAppSelector(state => state.user.state.isFetched);
  const isLoading = useAppSelector(state => state.user.state.isLoading);
  const [isFirstRender, setIsFirstRender] = React.useState(true);

  React.useEffect(() => {
    if (isFetched) return;
    const getMe = async () => {
      const { data, error } = await api.GET('/auth/get/me');
      if (error) return navigate('/signup', { replace: true });

      if (data.role === 'PATIENT') dispatch(setPatientData(data.patient!), dispatch(getMyDeclarations()));
      else if (data.role === 'DOCTOR') dispatch(setDoctorDataUser(data.doctor!));
      dispatch(setUserState({ isLoading: false, isFetched: true }));
      dispatch(setUserData({ role: data.role }));
    };

    getMe();
  }, []);

  React.useEffect(() => {
    if (isFirstRender) return void setIsFirstRender(false);
    if (isLoading || isFetched) return;
    navigate('/signup', { replace: true });
  }, [isFetched, isLoading]);

  if (isFetched) return Page ? <Page /> : <Outlet />;

  return <PatientDashboardSkeleton />;
};

export const ProtectPatientRoute: React.FC<{ Page?: React.ElementType }> = ({ Page }) => {
  const patient = useAppSelector(state => state.patient.data);
  const role = useAppSelector(state => state.user.data.role);
  if (!patient || role !== 'PATIENT') return null;
  return Page ? <Page /> : <Outlet />;
};

export const ProtectDoctorRoute: React.FC<{ Page?: React.ElementType }> = ({ Page }) => {
  const doctor = useAppSelector(state => state.doctor.doctorUser);
  const role = useAppSelector(state => state.user.data.role);
  if (!doctor || role !== 'DOCTOR') return null;
  return Page ? <Page /> : <Outlet />;
};
