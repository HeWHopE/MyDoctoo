import type React from 'react';
import type { IconProps } from './types';

// Account & Authentication Icons
import AccountIcon from '@assets/icons/account.svg?react';
import UsersIcon from '@assets/icons/users.svg?react';
import LogoutIcon from '@assets/icons/logout.svg?react';

// Appointment & Schedule Icons
import AppointmentsIcon from '@assets/icons/appointments.svg?react';
import DateIcon from '@assets/icons/date.svg?react';
import TimerIcon from '@assets/icons/timer.svg?react';

// Communication Icons
import ChatsIcon from '@assets/icons/chats.svg?react';
import JoinCallIcon from '@assets/icons/join-the-call.svg?react';
import LeaveCallIcon from '@assets/icons/leave-the-call.svg?react';
import MuteIcon from '@assets/icons/mute.svg?react';
import MutedIcon from '@assets/icons/muted.svg?react';
import SendMessageIcon from '@assets/icons/send-message.svg?react';
import SentInvoiceIcon from '@assets/icons/sent-invoice.svg?react';

// Data Management Icons
import AttachIcon from '@assets/icons/attach.svg?react';
import DownloadIcon from '@assets/icons/download.svg?react';
import EditIcon from '@assets/icons/edit.svg?react';
import DeleteIcon from '@assets/icons/delete.svg?react';
import FileIcon from '@assets/icons/file.svg?react';
import SearchIcon from '@assets/icons/search.svg?react';
import StarIcon from '@assets/icons/star.svg?react';
import StarHalfIcon from '@assets/icons/star-half.svg?react';

// Medical Icons
import BloodTypeIcon from '@assets/icons/blood-type.svg?react';
import HeightIcon from '@assets/icons/height.svg?react';
import WeightIcon from '@assets/icons/weight.svg?react';

// Navigation Icons
import ArrowRightIcon from '@assets/icons/arrow-right.svg?react';
import ShevronRightIcon from '@assets/icons/shevron-right.svg?react';
import ShevronMiniClosedIcon from '@assets/icons/shevron-mini-closed.svg?react';
import ShevronMiniOpenIcon from '@assets/icons/shevron-mini-open.svg?react';

// Notification Icons
import NotificationsIcon from '@assets/icons/notifications.svg?react';
import WarningIcon from '@assets/icons/warning.svg?react';
import ValidIcon from '@assets/icons/valid.svg?react';

// Personal Icons
import MyDoctorsIcon from '@assets/icons/my-doctors.svg?react';
import QuickNotesIcon from '@assets/icons/quick-notes.svg?react';

// Settings & Configuration Icons
import ChangeIcon from '@assets/icons/change.svg?react';
import DashboardIcon from '@assets/icons/dashboard.svg?react';
import SettingsIcon from '@assets/icons/settings.svg?react';
import CreditCardIcon from '@assets/icons/credit-card.svg?react';

// Social Media Icons
import FacebookIcon from '@assets/icons/facebook.svg?react';
import GoogleIcon from '@assets/icons/google.svg?react';

// UI Control Icons
import CloseIcon from '@assets/icons/close.svg?react';
import EyeClosedIcon from '@assets/icons/eye-closed.svg?react';
import EyeOpenIcon from '@assets/icons/eye-open.svg?react';
import MinusIcon from '@assets/icons/minus.svg?react';
import PlusIcon from '@assets/icons/plus.svg?react';
import PauseIcon from '@assets/icons/pause.svg?react';
import RecordIcon from '@assets/icons/record.svg?react';
import StopIcon from '@assets/icons/stop.svg?react';
import VideoStoppedIcon from '@assets/icons/video-stopped.svg?react';
import VideoIcon from '@assets/icons/video.svg?react';
import SubtitlesIcon from '@assets/icons/subtitles.svg?react';

// Other Icons
import BoardIcon from '@assets/icons/board.svg?react';
import FavoriteEmptyIcon from '@assets/icons/favorite-empty.svg?react';
import FavoriteFilledIcon from '@assets/icons/favorite-filled.svg?react';
import GenderIcon from '@assets/icons/gender.svg?react';
import HelpIcon from '@assets/icons/help.svg?react';
import LocationTargetIcon from '@assets/icons/location-target.svg?react';
import ShareScreenIcon from '@assets/icons/share-screen.svg?react';

// Logo
import Logo from '@assets/logo.svg?react';

//Additional icons(not from figma)
import { Clock } from 'lucide-react';

export type IconType = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

function ClockIcon() {
  return <Clock className='stroke-[1.5]' />;
}

const IconVariants = {
  logo: Logo,
  account: AccountIcon,
  users: UsersIcon,
  logout: LogoutIcon,
  appointments: AppointmentsIcon,
  date: DateIcon,
  timer: TimerIcon,
  chats: ChatsIcon,
  'join-the-call': JoinCallIcon,
  'leave-the-call': LeaveCallIcon,
  mute: MuteIcon,
  muted: MutedIcon,
  'send-message': SendMessageIcon,
  'sent-invoice': SentInvoiceIcon,
  attach: AttachIcon,
  download: DownloadIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  file: FileIcon,
  search: SearchIcon,
  star: StarIcon,
  'star-half': StarHalfIcon,
  'blood-type': BloodTypeIcon,
  height: HeightIcon,
  weight: WeightIcon,
  'arrow-right': ArrowRightIcon,
  'shevron-right': ShevronRightIcon,
  'shevron-mini-closed': ShevronMiniClosedIcon,
  'shevron-mini-open': ShevronMiniOpenIcon,
  warning: WarningIcon,
  valid: ValidIcon,
  'my-doctors': MyDoctorsIcon,
  'quick-notes': QuickNotesIcon,
  change: ChangeIcon,
  dashboard: DashboardIcon,
  settings: SettingsIcon,
  'credit-card': CreditCardIcon,
  facebook: FacebookIcon,
  google: GoogleIcon,
  close: CloseIcon,
  'eye-closed': EyeClosedIcon,
  'eye-open': EyeOpenIcon,
  minus: MinusIcon,
  plus: PlusIcon,
  pause: PauseIcon,
  record: RecordIcon,
  stop: StopIcon,
  'video-stopped': VideoStoppedIcon,
  video: VideoIcon,
  subtitles: SubtitlesIcon,
  board: BoardIcon,
  'favorite-empty': FavoriteEmptyIcon,
  'favorite-filled': FavoriteFilledIcon,
  gender: GenderIcon,
  help: HelpIcon,
  'location-target': LocationTargetIcon,
  'share-screen': ShareScreenIcon,
  age: ClockIcon,
  notifications: NotificationsIcon,
};

const Icon: React.FunctionComponent<IconProps> = ({ variant, ...props }) => {
  const IconComponent = IconVariants[variant] || null;

  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...props} />;
};

export default Icon;
