import {Account} from './account';
import {Currency} from "./currency";
import {Category} from "./category";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  date: Date;
  account: Account;
  fromAccount?: Account;
  toAccount?: Account;
  notes?: string;
  type: TransactionType,
  isBankTransaction: boolean;
  category?: Category
}

export enum TransactionType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
  TRANSFER = "TRANSFER",
}
