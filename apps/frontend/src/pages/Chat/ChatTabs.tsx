import { useLocation } from 'react-router';
import ChatTab from './Components/ChatComponents/ChatTab/ChatTab';
import { Role } from '@/dataTypes/User';

type ChatTabsProps = {
  countChats?: number;
  role?: string;
};

const ChatTabs = ({ countChats, role = Role.PATIENT }: ChatTabsProps) => {
  const location = useLocation();
  const getSelected = (to: string) => {
    return location.pathname.startsWith('/chats' + to);
  };

  return (
    <div className=''>
      <div className='tabs inline-flex rounded-t-xl bg-main-light'>
        <ChatTab to='/my' active={getSelected('/my')}>
          {role === Role.PATIENT ? 'Doctors' : 'Patients'}
          {countChats ? (
            <span className='flex size-6 items-center justify-center rounded-2xl bg-grey-5 text-sm'>{countChats}</span>
          ) : null}
        </ChatTab>
        <ChatTab to='/assistant' active={getSelected('/assistant')}>
          Virtual assistant
        </ChatTab>
      </div>
    </div>
  );
};

export default ChatTabs;
