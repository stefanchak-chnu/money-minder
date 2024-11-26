import { BankType } from './bank-type';

export interface Bank {
  id: string;
  name: string;
  type: BankType;
}
