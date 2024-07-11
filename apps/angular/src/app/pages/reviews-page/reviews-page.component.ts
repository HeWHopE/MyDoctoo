import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { IReview } from '../../data-types/review-types';
import { AppState } from '../../states/app.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { fetchReviews } from '../../states/review/review.actions';
import { ActivatedRoute } from '@angular/router';
import { selectReviews } from '../../states/review/review.selectors';
import { IDoctor } from '../../data-types/doctor-types';
import { selectCurrentDoctor } from '../../states/doctor/doctor.selectors';
import { fetchDoctorById } from '../../states/doctor/doctor.actions';
import { fetchPatient } from '../../states/patient/patient.actions';
import { IPatient } from '../../data-types/patient-types';
import { selectPatient } from '../../states/patient/patient.selectors';
import { ReviewsHeaderComponent } from './reviews-page-header/reviews-header.component';
import { ReviewsBodyComponent } from './reviews-page-body/reviews-body.component';
import { getCustomPaginatorIntl } from '../../../utilities/getCustomPaginator';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [CommonModule, ReviewsHeaderComponent, ReviewsBodyComponent, MatPaginatorModule],
  templateUrl: './reviews-page.component.html',
  providers: [{ provide: MatPaginatorIntl, useValue: getCustomPaginatorIntl('Reviews per page') }],
  styleUrls: ['./reviews-page.component.scss'],
})
export class ReviewsPageComponent implements OnInit {
  reviews$: Observable<IReview[]> = this.store.select(selectReviews);

  doctor$: Observable<IDoctor | undefined> = this.store.select(selectCurrentDoctor);

  patient$: Observable<IPatient | undefined> = this.store.select(selectPatient);

  currentPage: number = 1;
  reviewsPerPage: number = 3;

  constructor(
    private readonly store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  handlePageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.reviewsPerPage = event.pageSize;
    const doctorId = this.route.snapshot.params['doctorId'];
    if (doctorId !== null) {
      this.store.dispatch(
        fetchReviews({
          doctorId,
          includeNames: 'true',
          skip: ((this.currentPage - 1) * this.reviewsPerPage).toString(),
          take: this.reviewsPerPage.toString(),
        })
      );
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const doctorId = params.get('doctorId');
      if (doctorId) {
        this.store.dispatch(fetchDoctorById({ doctorId }));
        this.store.dispatch(
          fetchReviews({
            doctorId,
            includeNames: 'true',
            skip: ((this.currentPage - 1) * this.reviewsPerPage).toString(),
            take: this.reviewsPerPage.toString(),
          })
        );
      }
    });

    this.store.dispatch(fetchPatient({ patientId: '29eff914-786b-47b5-b70e-20b9b8630a3a' }));
  }
}
