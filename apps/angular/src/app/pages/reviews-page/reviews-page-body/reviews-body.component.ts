import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IReview } from '../../../data-types/review-types';
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reviews-body',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './reviews-body.component.html',
  styleUrls: ['./reviews-body.component.scss'],
})
export class ReviewsBodyComponent implements OnChanges {
  @Input() reviews: IReview[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviews']) {
      this.cdr.detectChanges();
    }
  }
}
