import { Directive, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHideOnScroll]'
})
export class HideOnScrollDirective implements OnInit {
  @Output() scrollWatcher = new EventEmitter< boolean >();
  private lastScrollTop: number = 0;
  private scrollThreshold: number = 120;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(){
    this.onWindowScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isWithin120px = scrollTop <= this.scrollThreshold;

    this.scrollWatcher.emit(isWithin120px);

    if (isWithin120px) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', 'transparent');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    }

    if (scrollTop > this.lastScrollTop) {
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-100%)');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
    }

    this.renderer.setStyle(this.el.nativeElement, 'transition', 'transform 0.3s ease');
    this.lastScrollTop = Math.max(scrollTop, 0);
  }
}
