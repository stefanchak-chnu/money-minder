import { Currency } from './currency';
import { AccountType } from './account-type';

export interface MonobankAccount {
  id?: string;
  type: string;
  balance: number;
  currency: Currency;
  maskedPan?: string | null;
  iban: string;
  isLinked: boolean;
}
