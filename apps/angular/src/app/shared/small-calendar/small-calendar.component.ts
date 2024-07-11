import { Component, Input } from '@angular/core';
import weekdayPlugin from 'dayjs/plugin/weekday';
import dayjs, { Dayjs } from 'dayjs';
import { getMonthDays } from '../../../utilities/getMonthsDays';
import { CommonModule } from '@angular/common';
import { DAYS_OF_WEEK } from '../../../constants/daysOfWeek';
import { getMeetingStatusColor } from '../../../utilities/getMeetingsStatusColor';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

dayjs.extend(weekdayPlugin);

@Component({
  imports: [CommonModule, MatIconModule, MatCardModule],
  standalone: true,
  selector: 'app-small-calendar',
  templateUrl: 'small-calendar.component.html',
  styleUrls: ['small-calendar.component.scss'],
})
export class SmallCalendarComponent {
  daysOfWeek: string[] = DAYS_OF_WEEK;
  today: Dayjs = dayjs();
  currentMonth: Dayjs = this.today;
  days: Dayjs[] = [];

  get currentDate(): string {
    return this.currentMonth.toISOString();
  }

  getMeetingByStatusColor = getMeetingStatusColor;

  constructor() {
    this.updateDays();
  }

  updateDays() {
    this.days = getMonthDays(this.currentMonth);
  }

  @Input() meetingsForDay: { date: Date | Dayjs; status: string }[] | null = [];

  nextMonth() {
    if (this.currentMonth) {
      this.currentMonth = this.currentMonth.add(1, 'month');
      this.updateDays();
    }
  }

  prevMonth() {
    if (this.currentMonth) {
      this.currentMonth = this.currentMonth.subtract(1, 'month');
      this.updateDays();
    }
  }

  getMeetingsByStatus(day: Dayjs, meetingsForDay: { date: Date | Dayjs; status: string }[]) {
    const meetings = meetingsForDay && meetingsForDay.filter(meeting => day.isSame(meeting.date, 'day')).slice(0, 3);

    const meetingsByStatus =
      meetings &&
      meetings.reduce((acc, meeting) => {
        return {
          ...acc,
          [meeting.status]: meeting,
        };
      }, {});
    return meetingsByStatus;
  }
}
