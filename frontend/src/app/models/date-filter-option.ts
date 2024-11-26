export type DateFilterOption = {
  name: string;
  dateFrom: Date;
  dateTo: Date;
};

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

export const datesFilterOptions: DateFilterOption[] = [
  {
    name: "Custom date",
    dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
    dateTo: new Date()
  },
  {
    name: "Current month",
    dateFrom: new Date(currentYear, currentMonth, 2),
    dateTo: new Date(currentYear, currentMonth + 1, 1)
  },
  {
    name: "Current quarter",
    dateFrom: new Date(currentYear, Math.floor(currentMonth / 3) * 3, 2),
    dateTo: new Date(currentYear, Math.floor(currentMonth / 3) * 3 + 3, 1)
  },
  {
    name: "Current year",
    dateFrom: new Date(currentYear, 0, 2),
    dateTo: new Date(currentYear, 11, 31)
  }
];
