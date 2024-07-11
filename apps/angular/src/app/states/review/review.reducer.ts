import { createReducer, on } from '@ngrx/store';
import { fetchReviewsSuccess } from './review.actions';
import { IReview } from '../../data-types/review-types';

export interface ReviewState {
  reviews: IReview[];
}

export const initialState: ReviewState = {
  reviews: [],
};

export const reviewReducer = createReducer(
  initialState,
  on(fetchReviewsSuccess, (state, { reviews }) => {
    return {
      ...state,
      reviews,
    };
  })
);
