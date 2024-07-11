export default function ScheduleAbout({ about }: { about: string }) {
  return (
    <div className='flex flex-col gap-y-4'>
      <span className='text-lg font-semibold leading-6 text-black'>About me</span>
      <span className='text-base font-normal'>{about}</span>
    </div>
  );
}
