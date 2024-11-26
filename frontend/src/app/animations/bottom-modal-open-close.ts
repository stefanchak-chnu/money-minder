import { animate, style, transition, trigger } from '@angular/animations';

export const bottomModalOpenClose = trigger('bottomModalOpenClose', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('0.15s ease', style({ transform: 'translateY(0%)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)' }),
    animate('0.15s ease', style({ transform: 'translateY(100%)' })),
  ]),
]);
