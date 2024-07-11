import { forwardRef, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';

interface InputCodeProps extends React.InputHTMLAttributes<HTMLInputElement> {
  codeLength?: number;
  className?: string;
}

const InputCode = forwardRef<HTMLInputElement, InputCodeProps>(({ codeLength = 6, className, ...rest }, ref) => {
  const [code, setCode] = useState<string[]>(new Array(codeLength).fill(''));
  const inputs = useRef<HTMLInputElement[]>([]);

  const onInputAdd = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
    const value = e.target.value.trim();
    if (isNaN(Number(value))) return;
    if (value.length > 2) {
      const newCode = [...code];
      for (let i = 0; i < value.length; i++) {
        if (slot + i >= codeLength) break;
        newCode[slot + i] = value[i];
        inputs.current[slot + i].focus();
      }
      setCode(newCode);
      return;
    }
    if (slot < codeLength - 1 && value) inputs.current[slot + 1].focus();
    if (code[slot].length > 2) return;
    const newCode = [...code];
    newCode[slot] = value.at(-1) || '';
    setCode(newCode);
  };

  const onInputRemove = (slot: number) => {
    if (slot > 0) inputs.current[slot - 1].focus();
    const newCode = [...code];
    newCode[slot] = '';
    setCode(newCode);
  };

  return (
    <div>
      {code.map((el, i) => (
        <input
          key={i}
          ref={el => inputs.current.push(el!)}
          type='text'
          value={el}
          {...rest}
          onChange={e => {
            onInputAdd(e, i);
            setCode(prev => {
              const value = prev.join('');
              rest.onChange?.call(null, { ...e, target: { ...e.target, value } });
              return prev;
            });
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace') onInputRemove(i);
          }}
          className={cn('mr-2 h-10 w-10 rounded-md bg-grey-5 text-center', className, i === 2 && 'mr-6')}
        />
      ))}
      <input ref={ref} type='hidden' value={code.join('')} />
    </div>
  );
});

InputCode.displayName = 'InputCode';

export default InputCode;
