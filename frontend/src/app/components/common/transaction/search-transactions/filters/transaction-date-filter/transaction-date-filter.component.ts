import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import {
  DateFilterOption,
  datesFilterOptions,
} from '../../../../../../models/date-filter-option';
import { bottomModalOpenClose } from '../../../../../../animations/bottom-modal-open-close';

@Component({
  selector: 'app-transaction-date-filter',
  standalone: true,
  imports: [MatIcon, NgForOf, NgIf, DatePipe],
  templateUrl: './transaction-date-filter.component.html',
  styleUrl: './transaction-date-filter.component.scss',
  animations: [bottomModalOpenClose],
})
export class TransactionDateFilterComponent {
  @Input() dateFilterOption: DateFilterOption = datesFilterOptions[0];
  @Output() dateFilterOptionSelected = new EventEmitter<DateFilterOption>();
  @Output() closed = new EventEmitter<void>();

  protected readonly datesFilterOptions = datesFilterOptions;

  constructor() {}

  closeModal() {
    this.closed.emit();
  }

  reset() {
    this.dateFilterOptionSelected.emit(undefined);
  }

  selectDateOption(dateOption: DateFilterOption) {
    this.dateFilterOption = dateOption;
  }

  apply() {
    this.dateFilterOptionSelected.emit(this.dateFilterOption);
  }

  protected readonly Date = Date;

  applyInputDateFrom(value: string) {
    this.dateFilterOption.dateFrom = new Date(value);
  }

  applyInputDateTo(value: string) {
    this.dateFilterOption.dateTo = new Date(value);
  }
}
