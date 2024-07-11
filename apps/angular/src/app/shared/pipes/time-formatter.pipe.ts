import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  standalone: true,
  name: 'timeFormatter',
})
export class TimeFormatterPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();

    const diffHours = Math.abs(Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60)));
    const diffMinutes = Math.abs(Math.floor((now.getTime() - date.getTime()) / (1000 * 60)));

    if (diffHours < 1) {
      if (diffMinutes === 0) {
        return 'less than a minute ago';
      }
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }

    if (diffHours <= 6) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }

    const formattedDate = this.datePipe.transform(date, 'mediumDate');
    return formattedDate ? formattedDate : 'Invalid date';
  }
}
