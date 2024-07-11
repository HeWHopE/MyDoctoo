import { Link } from 'react-router-dom';
import Icon from '@UI/Icon/Icon';

type LogoTextProps = {
  variant?: 'small' | 'large';
};

const NavLogo: React.FunctionComponent<LogoTextProps> = ({ variant = 'large' }) => {
  return (
    <Link
      to={'/'}
      className={`flex items-center ${variant === 'small' ? 'justify-center' : ''} sticky gap-2 text-white no-underline`}
    >
      <Icon variant='logo' className={variant === 'large' ? 'size-[26px]' : 'size-[36px]'} />
      {variant !== 'small' && <span className='font-syncopate text-xl font-bold uppercase text-white'>Doctoo</span>}
    </Link>
  );
};

export default NavLogo;
