import NavLogo from '@UI/NavLogo/NavLogo';

type HeaderProps = {
  children?: React.ReactNode;
};

const Header: React.FunctionComponent<HeaderProps> = ({ children }) => {
  return (
    <header className='flex w-full items-center justify-between bg-main px-8 py-2'>
      <NavLogo variant='large' />
      {children}
    </header>
  );
};

export default Header;
