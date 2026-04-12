export interface CreateReviewPayload {
  orderId: string;
  rating: number;
  comment: string;
  qualityRating?: number;
  communicationRating?: number;
  timelinessRating?: number;
  professionalismRating?: number;
  valueRating?: number;
  isAnonymous?: boolean;
}
