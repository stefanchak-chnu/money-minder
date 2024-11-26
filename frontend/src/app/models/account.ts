import {Currency} from './currency';
import {AccountType} from "./account-type";

export interface Account {
  id?: string;
  name: string;
  description?: string;
  balance: number;
  currency: Currency;
  type: AccountType;
  isBankAccount: boolean;
}
