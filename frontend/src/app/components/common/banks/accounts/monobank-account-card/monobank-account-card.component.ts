import {Component, Input} from '@angular/core';
import {MonobankAccount} from "../../../../../models/monobank-account";
import {NgClass, NgIf, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-monobank-account-card',
  standalone: true,
  imports: [NgIf, SlicePipe, NgClass],
  templateUrl: './monobank-account-card.component.html',
  styleUrl: './monobank-account-card.component.scss',
})
export class MonobankAccountCardComponent {
  @Input()
  monobankAccount!: MonobankAccount;
}
