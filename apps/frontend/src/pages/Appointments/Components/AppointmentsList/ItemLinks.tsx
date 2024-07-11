type AppointmentLinksProps = { videoRecordKey: string; notes: string };

export default function AppointmentLinks({ videoRecordKey, notes }: AppointmentLinksProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.stopPropagation();
  };

  return (
    <div>
      {videoRecordKey && (
        <a href={videoRecordKey} target='_blank' onClick={handleClick} rel='noreferrer'>
          video recording
        </a>
      )}
      {videoRecordKey && notes && ', '}
      {notes && (
        <a href={notes} target='_blank' onClick={handleClick} rel='noreferrer'>
          notes
        </a>
      )}
    </div>
  );
}
