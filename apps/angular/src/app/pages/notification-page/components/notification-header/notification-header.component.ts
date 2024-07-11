import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { FileData, INotification, NotificationActionEnum } from '../../../../data-types/notification-types';
import { IconsNames } from '../../../../shared/configs/icons.config';
import { TimeFormatterPipe } from '../../../../shared/pipes/time-formatter.pipe';
import { FileService } from '../../../../../api/http-file.service';

@Component({
  selector: 'app-notification-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, TimeFormatterPipe],
  templateUrl: './notification-header.component.html',
  styleUrl: './notification-header.component.scss',
})
export class NotificationHeaderComponent implements OnInit {
  @Input() item: INotification = {} as INotification;
  @Input() isGridView: boolean = true;

  constructor(private fileService: FileService) {}

  public notificationActionEnum = NotificationActionEnum;
  public iconNames = IconsNames;
  public isNewAppointment = false;
  private redirectUrl: string = '';

  ngOnInit() {
    this.isNewAppointment = this.item.action === NotificationActionEnum.NEW_APPOINTMENT;
  }

  getTimeFromResponse(item: INotification): string {
    if (item.action === this.notificationActionEnum.CONFIRMED_APPOINTMENT && item.appointment) {
      const appointmentTime = new Date(item.appointment.startedAt);
      const datePipe = new DatePipe('en-US');

      const formattedTime = datePipe.transform(appointmentTime, "EEE, MMM d 'at' h:mm a");

      return formattedTime ? formattedTime : '';
    } else {
      return '';
    }
  }

  getFile(fileKey: string) {
    this.fileService.getFile(fileKey).subscribe((fileData: FileData) => {
      window.open(fileData.url, '_blank');
    });
  }

  redirectToPaymentPage(appointmentId: string): void {
    this.redirectUrl = `/payment/${appointmentId}`;
    window.location.assign(this.redirectUrl);
  }
}
