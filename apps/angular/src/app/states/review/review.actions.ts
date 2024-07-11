import { createAction, props } from '@ngrx/store';
import { IReview } from '../../data-types/review-types';

export const fetchReviews = createAction(
  '[Review] Fetch Reviews',
  props<{
    doctorId: string;
    includeNames: string;
    skip: string;
    take: string;
  }>()
);

export const fetchReviewsSuccess = createAction('[Review] Fetch Reviews Success', props<{ reviews: IReview[] }>());
