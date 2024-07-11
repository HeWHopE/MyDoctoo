import { Component, Input } from '@angular/core';
import { SkeletonComponent } from '../../../../shared/skeleton/skeleton.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-notification-skeleton',
  standalone: true,
  imports: [SkeletonComponent, NgClass],
  templateUrl: './notification-skeleton.component.html',
  styleUrl: './notification-skeleton.component.scss',
})
export class NotificationSkeletonComponent {
  @Input() isGridView: boolean = false;
  amountOfCards: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
