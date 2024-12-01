import { ElementRef, Renderer2 } from '@angular/core';
import { HideOnScrollDirective } from './hide-on-scroll.directive';

describe('HideOnScrollDirective', () => {
  let elementRef: ElementRef;
  let renderer: Renderer2;
  it('should create an instance', () => {
    const directive = new HideOnScrollDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
