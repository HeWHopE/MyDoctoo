import Sidemenu from '@components/Sidemenu/Sidemenu';
import Header from '@components/UI/Header/Header';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppointmentsPage from './Appointments/AppointmentsPage';
import DoctorLoginPage from './auth/login/DoctorLoginPage';
import LoginPage from './auth/login/LoginPage';
import LoginPageAuthenticate from './auth/login/LoginPageAuthenticate';
import LogoutPage from './auth/logout/Logout';
import { ProtectDoctorRoute, ProtectPatientRoute, ProtectRoute } from './auth/ProtectPatientPage';
import SignUpPage from './auth/signup/SignUpPage';
import SignUpPatientPage from './auth/signup/SignUpPatientPage';
import CalendarPage from './Calendar/CalendarPage';
import EmailChangePage from './EmailChange/EmailChangePage';
import MyDoctorsPage from './MyDoctors/MyDoctorsPage';
import { PaymentPage } from './PaymentPage/PaymentPage';
import ProfilePage from './Profile/ProfilePage';
import ReviewsPage from './Reviews/ReviewsPage';
import Settings from './settings/settingsPage/settingsPage';
import { useAppSelector } from '../app/hooks';
import PatientDashboard from './dashboard/components/PatientDashboard/PatientDashboard';
import DoctorDashboard from './dashboard/components/DoctorDashboard/DoctorDashboard';
import { type FC, type PropsWithChildren, useMemo } from 'react';
import ChatPage from './Chat/ChatPage';
import { FindDoctorsPage } from './FindDoctors/FindDoctorsPage';
import { DoctorVideoChatPage, PatientVideoChatPage } from './VideoChat/VideoChat';
import VideoChatEnd from './VideoChat/VideoChatEnd';
import LaunchPage from './LaunchPhir/launch';
import NotFoundPage from './NotFound/NotFoundPage';
import { AngularWrapper } from '@/angular-module/AngularWrapper';
import { SchedulePopupProvider } from '@/hooks/popups/useSchedulePopup';
import { AppointmentPopupProvider } from '@/hooks/popups/useAppointmentPopup';

const PatientPages = () => {
  return (
    <Routes>
      <Route path='/' Component={ProtectPatientRoute}>
        <Route path='/profile' Component={ProfilePage} />
        <Route path='/dashboard' Component={PatientDashboard} />
        <Route path='/settings' Component={Settings} />
        <Route path='/payment/:appointmentId' Component={PaymentPage} />
        <Route path='/my-doctors' Component={MyDoctorsPage} />
        <Route path='/logout' Component={LogoutPage} />

        <Route path='/video-call/:conferenceId' Component={PatientVideoChatPage} />
        <Route path='/video-call/ended/:conferenceId' Component={VideoChatEnd} />

        <Route path='/launch' Component={LaunchPage} />
        <Route path='/chats/my' Component={ChatPage} />
        <Route path='/chats/assistant' Component={ChatPage} />
        <Route path='/doctors' Component={FindDoctorsPage} />

        <Route path='/calendar' Component={CalendarPage} />
        <Route path='/reviews' Component={ReviewsPage} />
        <Route path='/appointments' Component={AppointmentsPage} />

        {/* <Route path='/calendar' element={<AngularWrapper path='calendar' />} />
        <Route path='/appointments' element={<AngularWrapper path='appointments' />} />
        <Route path='/reviews' element={<AngularWrapper path='reviews' />} /> */}
        <Route path='/notifications' element={<AngularWrapper path='notifications' />} />

        <Route path='*' element={<Navigate to={'/404'} />} />
      </Route>
    </Routes>
  );
};

const DoctorPages = () => {
  return (
    <Routes>
      <Route path='/' Component={ProtectDoctorRoute}>
        <Route path='/profile' Component={ProfilePage} />
        <Route path='/dashboard' Component={DoctorDashboard} />
        <Route path='/settings' Component={Settings} />
        {/* <Route path='/payment' Component={PaymentPage} /> */}
        <Route path='/calendar' Component={CalendarPage} />
        <Route path='/reviews' Component={ReviewsPage} />
        <Route path='/appointments' Component={AppointmentsPage} />
        <Route path='/logout' Component={LogoutPage} />
        <Route path='/chats/my' Component={ChatPage} />
        <Route path='/chats/assistant' Component={ChatPage} />
        <Route path='/video-call/:conferenceId' Component={DoctorVideoChatPage} />

        <Route path='*' element={<Navigate to={'/404'} />} />
      </Route>
    </Routes>
  );
};

const MainContentWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className='main-wrapper flex h-full w-full flex-col gap-6 overflow-auto bg-background p-4 sm:p-8'>
      {children}
    </main>
  );
};

const PageContainer = () => {
  const role = useAppSelector(state => state.user.data.role);

  const Page = useMemo(() => {
    if (!role) return null;
    const pages: any = {
      PATIENT: PatientPages,
      DOCTOR: DoctorPages,
    };
    return pages[role];
  }, [role]);

  return (
    <Routes>
      <Route path='/' Component={ProtectRoute}>
        <Route path='/' element={<Navigate to={'/dashboard'} />} />
        <Route path='*' Component={Page} />
      </Route>
    </Routes>
  );
};

const Navigation = () => {
  const location = useLocation();
  const role = useAppSelector(state => state.user.data.role);

  const shouldDisplaySidemenu = () => {
    const topLevelPaths = ['/payment', '/video-call'];
    const currentTopLevelPath = location.pathname.split('/')[1];
    return !topLevelPaths.includes('/' + currentTopLevelPath);
  };

  const shouldDispaySmallSideMenu = () => {
    const topLevelPaths = ['/calendar'];
    const currentTopLevelPath = location.pathname.split('/')[1];
    return topLevelPaths.includes('/' + currentTopLevelPath);
  };

  const shouldNotWrapInMainContent = () => {
    const topLevelPaths = ['/video-call'];
    const currentTopLevelPath = location.pathname.split('/')[1];
    return topLevelPaths.includes('/' + currentTopLevelPath);
  };

  return (
    <SchedulePopupProvider>
      <AppointmentPopupProvider>
        <Routes>
          <Route
            path='*'
            element={
              <div className={`flex ${!shouldDisplaySidemenu() ? 'flex-col' : ''} h-screen w-screen overflow-hidden`}>
                {shouldDisplaySidemenu() ? (
                  <Sidemenu role={role} variant={shouldDispaySmallSideMenu() ? 'small' : 'large'} />
                ) : (
                  <Header />
                )}
                {shouldNotWrapInMainContent() ? (
                  <PageContainer />
                ) : (
                  <MainContentWrapper>
                    <PageContainer />
                  </MainContentWrapper>
                )}
              </div>
            }
          />

          <Route path='/signup' Component={SignUpPage} />
          <Route path='/signup/patient' Component={SignUpPatientPage} />
          <Route path='/login/authenticate' Component={LoginPageAuthenticate} />
          <Route path='/login' Component={LoginPage} />
          <Route path='/login/doctor' Component={DoctorLoginPage} />
          <Route path='/change-email' Component={EmailChangePage} />

          <Route path='/404' Component={NotFoundPage} />
        </Routes>
      </AppointmentPopupProvider>
    </SchedulePopupProvider>
  );
};

export default Navigation;
