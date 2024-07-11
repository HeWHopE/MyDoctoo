import Input from '@/components/UI/Input/Input';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';

export const NewPaymentCardForm = () => {
  const inputFieldClass =
    'w-full rounded-lg bg-background py-3 border border-transparent pl-4 pr-10 text-base text-text hover:border hover:border-text focus:border focus:outline-none focus:border-text';
  const labelClass = 'text-md flex flex-col justify-items-start gap-2 text-grey-1';

  return (
    <form id='payment' className='w-full max-w-[352px]' onSubmit={e => e.preventDefault()}>
      <div className='flex flex-col gap-4'>
        <label htmlFor='card-nr' className={labelClass}>
          <p>Card number</p>
          <CardNumberElement id='card-nr' className={inputFieldClass} />
        </label>

        <div className='grid grid-cols-1 justify-start gap-4 sm:grid-cols-2'>
          <label htmlFor='card-expiry' className={labelClass}>
            <p>Expiry date (MM/YY)</p>
            <CardExpiryElement id='card-expiry' className={inputFieldClass} />
          </label>
          <label htmlFor='card-cvc' className={labelClass}>
            <p>CVC</p>
            <CardCvcElement id='card-cvc' className={inputFieldClass} />
          </label>
        </div>

        <Input label='Cardholder name' id='cardholderName' type='text' errorMessage='Please type cardholder name' />
      </div>
    </form>
  );
};
