import { Currency } from './currency';

export interface NetWorth {
  totalAccountsBalance: string;
  primaryCurrency: Currency;
  histories: NetWorthHistory[];
}

export interface NetWorthHistory {
  balance: string;
  date: string;
}
