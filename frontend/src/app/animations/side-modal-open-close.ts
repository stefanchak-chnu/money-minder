import { animate, style, transition, trigger } from '@angular/animations';

export const sideModalOpenClose = trigger('sideModalOpenClose', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('0.15s ease', style({ transform: 'translateX(0%)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0%)' }),
    animate('0.15s ease', style({ transform: 'translateX(100%)' })),
  ]),
]);
