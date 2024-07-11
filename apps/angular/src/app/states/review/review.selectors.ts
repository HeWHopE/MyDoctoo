import { createSelector } from '@ngrx/store';
import { ReviewState } from './review.reducer';
import { AppState } from '../app.state';

export const selectReview = (state: AppState) => state.reviews;

export const selectReviews = createSelector(selectReview, (state: ReviewState) => state.reviews);
