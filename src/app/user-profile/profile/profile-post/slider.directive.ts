import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { IPostPhoto } from '../../profile.service';

@Directive({
  selector: '[appSlider]',
  exportAs: 'appSlider'
})
export class SliderDirective {
  @Input('appSlider') images!: IPostPhoto[] | string;
  private currentIndex: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.updateSlider();
  }

  public next(withFullScreen?: boolean) {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateSlider(withFullScreen);
    }
  }

  public prev(withFullScreen?: boolean) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider(withFullScreen);
    }
  }

  public canMoveNext(): boolean {
    return this.currentIndex < this.images.length - 1;
  }

  public canMovePrev(): boolean {
    return this.currentIndex > 0;
  }

  private updateSlider(withFullScreen?: boolean) {
    const container = this.el.nativeElement.querySelector('.slider-container');
    const imageWidth = container.querySelector('img')?.clientWidth || 0;
    let offset;
    if (withFullScreen) {
      offset = this.currentIndex * imageWidth;
    }
    else
      offset = this.currentIndex * (imageWidth - 10);
    this.renderer.setStyle(container, 'transform', `translateX(-${offset}px)`);
  }
}
