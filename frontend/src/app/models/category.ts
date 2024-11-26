export interface Category {
  id?: string;
  name: string;
  icon: string;
  position: number;
  type: CategoryType;
  subCategories?: Category[];
}

export enum CategoryType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}
