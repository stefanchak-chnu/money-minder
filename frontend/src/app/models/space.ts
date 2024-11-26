import {Currency} from "./currency";

export interface Space {
  id: string;
  name: string;
  primaryCurrency: Currency;
}
