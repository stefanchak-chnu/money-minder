import {Category} from "./category";
import {Account} from "./account";

export interface Rule {
  id: string;
  condition: Condition;
  assignCategory?: Category;
  markAsTransferFromAccount?: Account;
  markAsTransferToAccount?: Account;
}

export interface Condition {
  id: string;
  textToApply: string;
  type: ConditionType;
}

export interface ConditionType {
  value: string,
  description: string
}

export enum ConditionTypeEnum {
  TEXT_CONTAINS = "TEXT_CONTAINS",
  TEXT_EQUALS = "TEXT_EQUALS",
}
