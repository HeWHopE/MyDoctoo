import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Icon, Toggle } from '@/components/UI';
import { useEffect, useState } from 'react';
import { patchPatientData } from '../../../app/patient/PatientThunks';
import { ErrorMessage } from '../../auth/auth-components';
import SettingsPopup from '../settingsPopup/settingsPopup';
import { isPasswordExistThunk } from '../../../app/user/UserThunks';

const Settings = () => {
  const [showPopup, setShowPopup] = useState(false);
  const patient = useAppSelector(state => state.patient.data);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const isPasswordExist = useAppSelector(state => state.user.data.isPasswordExist);

  useEffect(() => {
    dispatch(isPasswordExistThunk());
  }, [showPopup]);

  const handleEmailNotificationToggleChange = async () => {
    await dispatch(
      patchPatientData({
        id: patient.id,
        body: { emailNotificationToggle: !patient.emailNotificationToggle },
      }),
    );
  };

  const handleTwoFactorAuthToggleChange = async () => {
    await dispatch(
      patchPatientData({
        id: patient.id,
        body: { twoFactorAuthToggle: !patient.twoFactorAuthToggle },
      }),
    )
      .unwrap()
      .catch(err => {
        setError(err.message);
      });
  };

  const handleBillPaymentToggleChange = async () => {
    await dispatch(
      patchPatientData({
        id: patient.id,
        body: { requestBillPaymentApproval: !patient.requestBillPaymentApproval },
      }),
    );
  };

  const settingsData = [
    {
      id: 'emailNotification',
      label: 'Send e-mail notifications',
      toggleState: patient.emailNotificationToggle,
      toggleHandler: handleEmailNotificationToggleChange,
    },
    {
      id: 'twoFactorAuth',
      label: 'Turn on two-factor authentication',
      toggleState: patient.twoFactorAuthToggle,
      toggleHandler: handleTwoFactorAuthToggleChange,
    },
    {
      id: 'billPayment',
      label: 'Request approval for bill payment',
      toggleState: patient.requestBillPaymentApproval,
      toggleHandler: handleBillPaymentToggleChange,
    },
  ];

  return (
    <>
      <div className='flex h-screen w-full flex-col gap-4'>
        <header className='mb-[9px] mt-[3px] flex w-full items-center gap-2'>
          <Icon variant='settings' className='text-main '></Icon> <h1 className='text-2xl '>Settings</h1>
        </header>

        <section className='flex items-center justify-center'>
          <div className='for-password w-full rounded-lg bg-white'>
            <div className='flex flex-col items-center justify-between gap-2 p-2 sm:flex-row sm:p-8'>
              <span className='text-lg font-medium text-dark-grey'>Password</span>
              <a href='#' className='text-lg font-medium text-main ' onClick={() => setShowPopup(true)}>
                {!isPasswordExist ? 'Set password' : 'Change password'}
              </a>
            </div>
          </div>
        </section>

        <section className='flex items-center justify-center'>
          <div className='for-password w-full rounded-lg bg-white p-2 sm:px-8 sm:py-4'>
            {settingsData.map(({ id, label, toggleState, toggleHandler }) => (
              <div key={id} className='p-2 sm:px-2 sm:py-0'>
                <div className={`${id !== 'billPayment' ? ' border-b border-grey-4' : ''}`}>
                  <div className='mb-3 flex items-center justify-between sm:mb-0 sm:px-0 sm:py-4'>
                    <span className='text-sm font-medium text-dark-grey sm:text-lg'>{label}</span>
                    <a href='#' className='text-lg text-main '>
                      <Toggle selected={toggleState} onSelectedChange={toggleHandler} label='' id={id} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <ErrorMessage message={error} />
          </div>
        </section>
      </div>

      {showPopup && (
        <SettingsPopup
          showPopup={showPopup}
          handleClosePopup={() => setShowPopup(false)}
          isPasswordExist={isPasswordExist}
        />
      )}
    </>
  );
};

export default Settings;
