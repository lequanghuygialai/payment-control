export interface PaymentForm {
  id?: string;
  type: PaymentType;
  title: string;
  total: number;
  date: Date;
}