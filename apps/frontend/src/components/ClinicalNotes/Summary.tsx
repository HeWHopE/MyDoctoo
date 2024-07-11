import type { INotesSummary } from '../../dataTypes/Appointment';

type SummaryProps = {
  summary: INotesSummary;
};

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <div className='space-y-6'>
      {summary.complaints.length ? (
        <div>
          <h3 className='text-base font-semibold'>Chief complaints</h3>
          <p className='text-base font-normal leading-6 text-grey-1'>
            During the appointment, the following patient complaints were identified:
          </p>
          <ul className='list-inside list-disc text-base font-normal leading-6 text-grey-1'>
            {summary.complaints.map((complaint, i) => (
              <li key={i} className='list-inside list-disc'>
                {complaint.name.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {summary.problematicBodyParts.length ? (
        <div>
          <h3 className='text-base font-semibold'>Problematic body parts</h3>
          <p className='text-base font-normal leading-6 text-grey-1'>A list of body parts that may have problems:</p>
          <ul className='list-inside list-disc  text-base font-normal leading-6 text-grey-1'>
            {summary.problematicBodyParts.map((bodyPart, i) => (
              <li key={i} className='list-inside list-disc'>
                {bodyPart.name.toLocaleLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
