import { Badge } from '@/components/UI';
import type { BadgeColorKeys, LabelColorKeys } from '@/components/UI/Badge/Badge';
import type { AppointmentStatus } from '@/dataTypes/Appointment';

type StatusColors = {
  [key in AppointmentStatus]: { badgeColor: BadgeColorKeys; labelColor: LabelColorKeys };
};

const statusColors: StatusColors = {
  PENDING_PAYMENT: { badgeColor: 'bg-orange-light', labelColor: 'text-orange' },
  PLANNED: { badgeColor: 'bg-orange-light', labelColor: 'text-orange' },
  COMPLETED: { badgeColor: 'bg-main-light', labelColor: 'text-main' },
  CANCELED: { badgeColor: 'bg-error-light', labelColor: 'text-error' },
  MISSED: { badgeColor: 'bg-error-light', labelColor: 'text-error' },
};

type AppointmentBadgesProps = { status: AppointmentStatus; paymentReceiptKey?: string };

export default function AppointmentBadges({ status, paymentReceiptKey }: AppointmentBadgesProps) {
  return (
    <div className='flex gap-x-3'>
      <Badge badgeColor={statusColors[status].badgeColor} labelColor={statusColors[status].labelColor}>
        {status === 'PENDING_PAYMENT'
          ? 'Waiting for payment'
          : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>

      {paymentReceiptKey !== null && status !== 'PENDING_PAYMENT' && (
        <Badge badgeColor='bg-orange-light' labelColor='text-orange'>
          Paid
        </Badge>
      )}
    </div>
  );
}
