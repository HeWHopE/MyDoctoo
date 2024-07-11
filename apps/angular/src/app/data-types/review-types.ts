export interface ICreateUpdateReview {
  text: string;
  rate: number;
}

export interface IReview {
  id: string;
  doctorId: string;
  rate: number;
  text: string;
  doctor?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  patient?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}
