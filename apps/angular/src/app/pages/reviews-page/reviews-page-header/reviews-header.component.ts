import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoctor } from '../../../data-types/doctor-types';
import { MatButtonModule } from '@angular/material/button';
import { AppButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-reviews-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, AppButtonComponent],
  templateUrl: './reviews-header.component.html',
  styleUrls: ['./reviews-header.component.scss'],
})
export class ReviewsHeaderComponent implements OnInit {
  constructor() {}

  fullName: string = '';

  @Input() doctor: IDoctor = {
    id: '',
    rating: 0,
    reviewsCount: 0,
    userId: '',
    payrate: 0,
    about: '',
    firstName: '',
    lastName: '',
    avatarKey: '',
    email: '',
    phone: '',
    specializations: [],
    hospitals: [],
  };

  @Input() openSchedule: () => void = () => {};

  ngOnInit(): void {
    this.fullName = `${this.doctor.firstName} ${this.doctor.lastName}`;
  }
}
