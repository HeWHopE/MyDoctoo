import { DoctorState } from './doctor/doctor.reducer';
import { NotificationState } from './notification/notification.reducer';
import { PatientState } from './patient/patient.reducer';
import { ReviewState } from './review/review.reducer';

export interface AppState {
  reviews: ReviewState;
  doctors: DoctorState;
  patients: PatientState;
  notifications: NotificationState;
}
