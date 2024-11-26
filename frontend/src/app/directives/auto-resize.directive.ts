import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement): void {
    this.adjustWidth(input);
  }

  private adjustWidth(input: HTMLInputElement): void {
    const temporarySpan = document.createElement('span');
    temporarySpan.style.visibility = 'hidden';
    temporarySpan.style.position = 'absolute';
    temporarySpan.style.height = 'auto';
    temporarySpan.style.width = 'auto';
    temporarySpan.style.whiteSpace = 'nowrap';
    temporarySpan.textContent = input.value || input.placeholder;

    document.body.appendChild(temporarySpan);

    input.style.width = `${temporarySpan.offsetWidth + 10}px`;

    document.body.removeChild(temporarySpan);
  }
}
