import type { Path } from 'react-router-dom';
import { Link } from 'react-router-dom';

type ChatTabProps = {
  to: string | Partial<Path>;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
};

const ChatTab = ({ to, active = false, className = '', children }: ChatTabProps) => {
  return (
    <Link
      to={'/chats' + to}
      className={`text-gray-6 inline-flex h-14 items-center gap-2 rounded-t-xl bg-main-light px-8 py-3 text-base font-medium no-underline transition-all max-md:p-4 max-md:text-sm ${active ? 'bg-white' : ''} ${className}`}
    >
      {children}
    </Link>
  );
};

export default ChatTab;
