import {Account} from "../../../../../models/account";
import {Category} from "../../../../../models/category";

export interface SearchTransactionFilters {
  account?: Account;
  category?: Category;
}
