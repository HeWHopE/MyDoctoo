import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchReviews, fetchReviewsSuccess } from './review.actions';
import { map, mergeMap } from 'rxjs/operators';
import { HttpReviewService } from '../../../api/http-review.service';

@Injectable()
export class ReviewEffects {
  fetchReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchReviews),
      mergeMap(action =>
        this.reviewService
          .getReviewsByDoctorId(action.doctorId, action.includeNames, action.skip, action.take)
          .pipe(map(reviews => fetchReviewsSuccess({ reviews })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private reviewService: HttpReviewService
  ) {}
}
