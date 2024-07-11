import dayjs from 'dayjs';
import Icon from '@UI/Icon/Icon';

type PaymentMethodCardProps = {
  card: {
    number: string;
    expiresAt: Date;
  };
  editable?: boolean;
  onClickEdit?: React.MouseEventHandler<HTMLButtonElement>;
};

export const PaymentMethodCard = ({ card, editable, onClickEdit }: PaymentMethodCardProps) => {
  const hashCreditCardNumber = (cardNumber: string) => cardNumber.replace(/\d(?=.{4})/g, '*').match(/.{1,4}/g);
  const formatDateToMonthDay = (date: Date) => dayjs(date).format('MM/DD');

  return (
    <div className='flex w-full flex-col items-start gap-2 p-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
      <div className='flex items-center gap-2 sm:gap-4'>
        <div className='h-10 w-10 rounded-[6px] bg-main-light p-2 text-main-dark'>
          <Icon variant='credit-card' />
        </div>
        <div className='w-full'>
          <p className='font-medium'>{hashCreditCardNumber(card.number)}</p>
          <span className='font-normal text-grey-1'>Expires {formatDateToMonthDay(card.expiresAt)}</span>
        </div>
      </div>
      {editable ? (
        <button onClick={onClickEdit} className='flex gap-1 self-end font-normal text-grey-1 sm:self-start'>
          <Icon variant='edit' />
          Edit
        </button>
      ) : null}
    </div>
  );
};
