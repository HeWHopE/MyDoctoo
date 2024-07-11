import { OnInit, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { INotification } from '../../../../data-types/notification-types';
import { StarsRatingComponent } from '../../../../shared/stars-rating/stars-rating.component';

@Component({
  selector: 'app-notification-body',
  standalone: true,
  imports: [MatIconModule, MatCardModule, StarsRatingComponent],
  templateUrl: './notification-body.component.html',
  styleUrl: './notification-body.component.scss',
})
export class NotificationBodyComponent implements OnInit {
  @Input() item: INotification = {} as INotification;

  ngOnInit() {
    this.setDoctorName();
    this.setSpecializationNames();
    this.setDoctorRating();
    this.setDoctorImg();
  }

  public doctorName: string = 'doctor';
  public doctorId: string | undefined = this.item.doctorId;
  public specializationNames: string = '';
  public doctorRating: number = 0;
  public doctorReviewCount: number = 0;
  public appointmentActionTypes = [
    'NEW_APPOINTMENT',
    'CONFIRMED_APPOINTMENT',
    'UPCOMING_APPOINTMENT',
    'COMPLETED_APPOINTMENT',
  ];

  public url: string = '';
  public baseUrl = 'https://storage.googleapis.com/doctoo/';

  private setDoctorName(): void {
    const user = this.item.doctor?.user;

    if (user) {
      this.doctorName = 'Dr.' + ' ' + user.firstName + ' ' + user.lastName;
    }
  }

  private setSpecializationNames(): void {
    const specializations = this.item.doctor.specializations;

    if (specializations) {
      this.specializationNames = specializations.map(spec => spec.specialization.name).join(', ');
    }
  }

  private setDoctorRating(): void {
    const doctor = this.item.doctor;

    if (doctor) {
      this.doctorRating = doctor.rating;
      this.doctorReviewCount = doctor._count.reviews;
    }
  }

  private setDoctorImg(): void {
    const user = this.item.doctor?.user;

    if (user) {
      this.url = `${this.baseUrl}${user.avatarKey}`;
    }
  }
}
