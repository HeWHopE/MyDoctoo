import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, Location } from '@angular/common';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { AppointmentsPageComponent } from './pages/appointments-page/appointments-page.component';
import { ReviewsPageComponent } from './pages/reviews-page/reviews-page.component';
import { HttpAppointmentService } from '../api/http-appointment.service';
import { HttpDoctorService } from '../api/http-doctor.service';
import { HttpPatientService } from '../api/http-patient.service';
import { DatePipe } from '@angular/common';
import { HttpNotificationService } from '../api/http-notification.service';
import { NotificationPageComponent } from './pages/notification-page/notification-page.component';
import { HttpAuthService } from '../api/http-auth.service';
import { fetchPatientSuccess } from './states/patient/patient.actions';
import { Store } from '@ngrx/store';
import { AppState } from './states/app.state';
import { UserRoleEnum } from './data-types/user-types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CalendarPageComponent,
    AppointmentsPageComponent,
    ReviewsPageComponent,
    NotificationPageComponent,
    RouterOutlet,
  ],
  providers: [
    HttpAppointmentService,
    HttpDoctorService,
    HttpPatientService,
    HttpNotificationService,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnChanges, OnInit {
  constructor(
    private location: Location,
    private router: Router,
    private authService: HttpAuthService,
    private store: Store<AppState>
  ) {}

  @Input() path: string = this.location.path();

  public ngOnChanges(change: SimpleChanges): void {
    if (change['path'].currentValue !== change['path'].previousValue) {
      this.router.navigate([this.path]);
    }
  }

  public ngOnInit(): void {
    this.router.navigate([this.path]);
    this.authService.getAuthorizationData().subscribe({
      next: user => {
        if (user.role === UserRoleEnum.PATIENT && user.patient) {
          this.store.dispatch(fetchPatientSuccess({ currentPatient: user.patient }));
        }
      },
      error: error => {
        console.error(error);
      },
    });
  }
}
