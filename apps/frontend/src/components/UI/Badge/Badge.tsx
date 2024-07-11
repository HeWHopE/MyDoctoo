type BadgeColors = {
  transparent: '#00000000';
  black: '#202323';
  white: '#ffffff';
  text: '#454F50';
  'grey-1': '#707D7E';
  'grey-2': '#899596';
  'grey-3': '#AFBCBD';
  'grey-4': '#CAD7D9';
  'grey-5': '#E5EBEC';
  'dark-grey': '#454950';
  background: '#F1F6F9';
  main: '#089BAB';
  'main-medium': '#6BC3CD';
  'main-light': '#D9F0F2';
  'main-dark': '#057D8A';
  'main-darker': '#05616B';
  orange: '#F2A450';
  'orange-light': '#FDF4E7';
  error: '#ED5252';
  'error-light': '#FCF0ED';
  green: '#64C68D';
  'green-2': '#ACE9C5';
  'green-dark': '#35995F';
  'green-light': '#EFFAF4';
  'green-border': '#6BC3CD';
};

export type BadgeColorKeys = `bg-${keyof BadgeColors}`;
export type LabelColorKeys = `text-${keyof BadgeColors}`;

type BadgeProps = { children: React.ReactNode; badgeColor: BadgeColorKeys; labelColor: LabelColorKeys };

export default function Badge({
  children = 'Label',
  badgeColor = 'bg-main-light',
  labelColor = 'text-main',
}: BadgeProps) {
  return (
    <div className={`my-4 flex h-fit w-fit items-center justify-center rounded-2xl ${badgeColor} px-3 py-1 pb-1`}>
      <span className={`select-none text-sm font-normal ${labelColor}`}>{children}</span>
    </div>
  );
}
