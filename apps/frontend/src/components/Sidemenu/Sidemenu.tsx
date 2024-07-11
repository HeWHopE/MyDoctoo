import useWindowWide from '@/hooks/useWindowWide';
import type React from 'react';
import { useLocation } from 'react-router-dom';
import NavButton from './NavButton';
import NavLogo from '@UI/NavLogo/NavLogo';
import { cn } from '../../utils/cn';
import { Role } from '@/dataTypes/User';
import type { components } from '@/api';
import type { IconVariant } from '@UI/Icon/types';
import { useRef } from 'react';

type SidemenuProps = {
  variant?: 'small' | 'large';
  role?: components['schemas']['MeResponseDto']['role'];
};

type MenuItemsProps = {
  to: string;
  iconVariant: IconVariant;
  text: string;
};

const patientMenuItems: MenuItemsProps[] = [
  {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
  },
  {
    to: 'notifications',
    iconVariant: 'notifications',
    text: 'Notifications',
  },
  {
    to: '/appointments',
    iconVariant: 'appointments',
    text: 'Appointments',
  },
  {
    to: '/my-doctors',
    iconVariant: 'my-doctors',
    text: 'My doctors',
  },
  {
    to: '/chats/my',
    iconVariant: 'chats',
    text: 'Chats',
  },
  {
    to: '/calendar',
    iconVariant: 'date',
    text: 'Calendar',
  },
];

const doctorMenuItems: MenuItemsProps[] = [
  {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
  },
  {
    to: '/patients',
    iconVariant: 'users',
    text: 'Patients',
  },
  {
    to: '/chats/my',
    iconVariant: 'chats',
    text: 'Chats',
  },
  {
    to: '/calendar',
    iconVariant: 'date',
    text: 'Calendar',
  },
];

const mainMenuItems: MenuItemsProps[] = [
  {
    to: '/settings',
    iconVariant: 'settings',
    text: 'Settings',
  },
  {
    to: '/profile',
    iconVariant: 'account',
    text: 'Profile',
  },
  {
    to: '/logout',
    iconVariant: 'logout',
    text: 'Logout',
  },
];

const Sidemenu: React.FunctionComponent<SidemenuProps> = ({ variant = 'large', role }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const mn768 = useWindowWide(768);
  const mn1170 = useWindowWide(1170);
  let variantSize: typeof variant = variant === 'small' ? 'small' : mn768 ? 'large' : 'small';

  const location = useLocation();

  const getSelected = (to: string) => {
    return location.pathname.startsWith(to);
  };

  const isOpenDoctorDashboard = getSelected('/dashboard') && role === Role.DOCTOR && !mn1170;

  if (isOpenDoctorDashboard) {
    variantSize = 'small';
  }

  const menuItems = role === Role.PATIENT ? patientMenuItems : role === Role.DOCTOR ? doctorMenuItems : [];

  return (
    <nav
      ref={navRef}
      className={cn(
        'no-scrollbar sidemenu flex h-full shrink-0 flex-col overflow-y-auto bg-main',
        variantSize === 'large'
          ? 'w-72 items-stretch gap-8 p-8 pt-12'
          : 'w-16 items-center gap-[30px] p-4 pt-11 sm:w-20',
      )}
    >
      <NavLogo variant={variantSize} />

      <div className='menu flex flex-1 flex-col justify-start gap-4'>
        {menuItems.map((item, index) => (
          <NavButton
            key={index}
            to={item.to}
            iconVariant={item.iconVariant}
            text={item.text}
            variant={variantSize}
            selected={getSelected(item.to)}
            parentRef={navRef}
          />
        ))}
      </div>

      <div className='menu flex flex-col justify-start gap-4'>
        {mainMenuItems.map((item, index) => (
          <NavButton
            key={index}
            to={item.to}
            iconVariant={item.iconVariant}
            text={item.text}
            variant={variantSize}
            selected={getSelected(item.to)}
            parentRef={navRef}
          />
        ))}
      </div>
    </nav>
  );
};

export default Sidemenu;
