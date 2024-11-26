import { Account } from './account';
import {Currency} from "./currency";

export interface TypeGroupedAccounts {
  accountTypeId: number;
  name: string;
  accounts: Account[];
  totalBalance: number;
  primaryCurrency: Currency;
}
