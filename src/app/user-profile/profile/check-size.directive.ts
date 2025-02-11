import { Directive, HostListener } from '@angular/core';
import { ProfilePostComponent } from './profile-post/profile-post.component';

@Directive({
  selector: '[appCheckSize]'
})
export class CheckSizeDirective {

  constructor(private postComponent: ProfilePostComponent) { }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  private checkScreenSize(): void {
    if (window.innerWidth < 600)
      this.postComponent.smallScreen = true;
    else
      this.postComponent.smallScreen = false;
  }
}
