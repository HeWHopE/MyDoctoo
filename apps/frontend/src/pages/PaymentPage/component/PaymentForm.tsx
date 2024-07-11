import { useState } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getPaymentIntent, updatedAppointmentStatusAfterSuccessfulPayment } from '@/app/payment/paymentThunks';
import { Button, Icon, Checkbox, RadioButton } from '@/components/UI';
import { NewPaymentCardForm } from './NewPaymentCardForm';
import { Checkout } from './Checkout';
import { PaymentPopup } from './PaymentPopup';
import type { IAppointment } from '@/dataTypes/Appointment';

const schema = Joi.object({
  cardholderName: Joi.string()
    .regex(/^[a-zA-Zа-яА-ЯіїєґІЇЄҐ\s]{3,30}$/u)
    .required(),
  agreedToTerms: Joi.boolean().valid(true).required(),
});

export const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const { id: appointmentId } = useAppSelector(state => state.appointment.appointment) as IAppointment;

  const [isSuccessfulPayment, setIsSuccessfulPayment] = useState<boolean>(false);
  const [paymentDetails, setPaymentDetails] = useState({ id: '', created: 0 });
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const methods = useForm({
    mode: 'onChange',
    resolver: joiResolver(schema),
  });

  const {
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = methods;

  const [status, setStatus] = useState<string>('new-card');

  const navigateBack = () => {
    window.history.back();
    setIsOpenModal(false);
  };

  const onSubmit = async () => {
    if (!elements || !stripe) {
      return;
    }

    const cardElement = elements?.getElement(CardNumberElement);
    const cardExpiry = elements?.getElement(CardExpiryElement);
    const cardCVC = elements?.getElement(CardCvcElement);

    if (!cardElement || !stripe) {
      return;
    }

    setIsLoading(true);
    setIsOpenModal(true);

    try {
      const response = await dispatch(getPaymentIntent(appointmentId));
      const clientSecret = response.payload;

      const paymentMethod = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (!paymentMethod.paymentMethod) {
        setIsLoading(false);
        setIsOpenModal(false);
        return;
      }

      const confirmPayment = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.paymentMethod.id,
      });

      setIsLoading(false);

      if (confirmPayment.error) {
        setIsSuccessfulPayment(false);
        setIsOpenModal(true);
      } else {
        const { id, created } = confirmPayment.paymentIntent;
        setPaymentDetails({ id, created });
        setIsSuccessfulPayment(true);
        reset();
        setValue('agreedToTerms', false);
        cardElement.clear();
        cardExpiry?.clear();
        cardCVC?.clear();
        setIsOpenModal(true);
        dispatch(updatedAppointmentStatusAfterSuccessfulPayment(appointmentId));
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccessfulPayment(false);
      setIsOpenModal(true);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <section className='mx-auto my-0 flex w-full max-w-[941px] flex-col items-center gap-6 md:flex-row md:items-start'>
          <div className='w-full max-w-[381px] md:max-w-[600px]'>
            <button
              type='button'
              className='mb-5 flex items-center text-sm font-medium leading-5 text-text'
              onClick={navigateBack}
            >
              <Icon variant='arrow-right' className='rotate-180' />
              Back
            </button>
            <div className='flex w-full flex-col items-start gap-6 rounded-xl bg-white p-6'>
              <h3 className='text-lg leading-6 text-black'>Payment Method</h3>
              <RadioButton
                label='Saved payment methods'
                id='saved'
                name='payment'
                selected={status === 'saved'}
                onClick={e => setStatus(e.target.value || 'saved')}
              />
              {status === 'saved' && <p className='text-text'>You do not have any bank cards saved</p>}

              <RadioButton
                label='Bank card'
                id='bank'
                name='payment'
                selected={status === 'new-card'}
                onClick={e => setStatus(e.target.value || 'new-card')}
              />
              {status === 'new-card' && <NewPaymentCardForm />}
            </div>
          </div>
          <div className='flex w-full max-w-[381px] flex-col items-start gap-4 md:max-w-[309px]'>
            <h3 className='text-lg leading-6 text-black'>Your appointment</h3>
            <Checkout />

            <form id='payment' onSubmit={e => e.preventDefault()} className='grid gap-4'>
              <Checkbox id='agreedToTerms' className='self-start' errorMessage='Please check the checkbox'>
                <p>
                  By clicking Pay now button, I confirm that I have read and accept{' '}
                  <span className='underline'>General Terms and Conditions</span>, and{' '}
                  <span className='underline'>Privacy statement</span>
                </p>
              </Checkbox>

              <Button
                type='primary'
                className='w-full'
                onClick={methods.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
                btnType='submit'
                disabled={!isDirty || !isValid}
              >
                Pay now
              </Button>
            </form>
          </div>
        </section>
      </FormProvider>
      {isOpenModal && (
        <PaymentPopup
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
          isSuccessfulPayment={isSuccessfulPayment}
          paymentDetails={paymentDetails}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
