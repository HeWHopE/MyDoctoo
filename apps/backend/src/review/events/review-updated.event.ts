export class ReviewUpdatedEvent {
  readonly reviewId: string;
  readonly doctorId: string;

  constructor(reviewId: string, doctorId: string) {
    this.reviewId = reviewId;
    this.doctorId = doctorId;
  }
}
