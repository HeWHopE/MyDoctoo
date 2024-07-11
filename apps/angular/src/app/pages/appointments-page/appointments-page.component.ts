import { Component, OnInit } from '@angular/core';
import { SmallCalendarComponent } from '../../shared/small-calendar/small-calendar.component';
import { HttpAppointmentService } from '../../../api/http-appointment.service';
import { CommonModule } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { IAppointment } from '../../data-types/appointment-types';
import dayjs from 'dayjs';
import { StarsRatingComponent } from '../../shared/stars-rating/stars-rating.component';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [SmallCalendarComponent, StarsRatingComponent, CommonModule],
  templateUrl: './appointments-page.component.html',
})
export class AppointmentsPageComponent implements OnInit {
  appointment$!: Observable<IAppointment[]>;
  meetingsForDay$!: Observable<{ date: Date; status: string }[]>;
  constructor(private appointmentService: HttpAppointmentService) {}

  ngOnInit() {
    this.appointment$ = this.appointmentService.getAllAppointments();

    this.meetingsForDay$ = this.appointment$.pipe(
      map(appointments =>
        appointments.map(appointment => ({
          date: dayjs(appointment.startedAt).toDate(),
          status: appointment.status ? appointment.status.toUpperCase() : 'UNKNOWN',
        }))
      ),
      startWith([])
    );
  }
}
