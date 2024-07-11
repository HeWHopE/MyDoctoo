export interface IHospital {
  id: string;
  name: string;
  country: string;
  state?: string;
  city: string;
  street: string;
  zipCode?: number;
}
