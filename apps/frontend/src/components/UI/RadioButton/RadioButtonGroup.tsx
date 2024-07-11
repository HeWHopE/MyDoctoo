import type { RadioButtonProps } from './RadioButton';
import { RadioButton } from './RadioButton';

interface RadioButtonGroupProps {
  options: Omit<RadioButtonProps, 'name' | 'onClick' | 'selected'>[];
  className?: string;
  groupName: string;
  id: string;
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function RadioButtonGroup({
  options,
  className,
  groupName,
  selected,
  setSelected,
  id,
}: RadioButtonGroupProps) {
  return (
    <fieldset className={className}>
      {options.map((option, index) => (
        <RadioButton
          id={id}
          key={`${groupName}-${index}`}
          label={option.label}
          name={groupName}
          selected={selected === option.value || selected === option.label}
          onClick={() => setSelected(option.value || option.label)}
        />
      ))}
    </fieldset>
  );
}
