import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stars-rating',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './stars-rating.component.html',
  styleUrls: ['./stars-rating.component.scss'],
})
export class StarsRatingComponent {
  @Input() reviewsCount: number = 0;
  @Input() rating: number = 0;
  @Input() doctorId: string = '';
  @Input() size?: 'small' | 'default' = 'default';

  constructor() {}
}
