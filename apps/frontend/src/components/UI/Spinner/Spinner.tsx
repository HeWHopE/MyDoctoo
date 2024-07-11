import type React from 'react';
import './Spinner.css';

export interface SpinnerProps {
  size: number;
  color: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size, color, className = '' }) => {
  return (
    <div className={className}>
      <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle className='spinner spinner_delay_1 h-20 w-20 ' cx='12' cy='2' r='3' fill={color} />
        <circle className='spinner spinner_delay_2' cx='19.071' cy='5.071' r='3' fill={color} />
        <circle className='spinner spinner_delay_3' cx='21' cy='12' r='3' fill={color} />
        <circle className='spinner spinner_delay_4' cx='19.071' cy='18.929' r='3' fill={color} />
        <circle className='spinner spinner_delay_5' cx='12' cy='21' r='3' fill={color} />
        <circle className='spinner spinner_delay_6' cx='4.929' cy='18.929' r='3' fill={color} />
        <circle className='spinner spinner_delay_7' cx='3' cy='12' r='3' fill={color} />
        <circle className='spinner spinner_delay_8' cx='4.929' cy='5.071' r='3' fill={color} />
      </svg>
    </div>
  );
};

export default Spinner;
