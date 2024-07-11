export default function NotificationsComponent() {
  return (
    <div className='grid h-full min-h-[308px] w-full justify-items-center gap-0 rounded-xl bg-white p-2 sm:p-6'>
      <div className='flex w-full flex-row justify-between gap-2'>
        <h3 className='text-lg text-black'>Notifications</h3>
      </div>

      <p className='text-center text-black-2'>You don’t have any notifications yet</p>
    </div>
  );
}
