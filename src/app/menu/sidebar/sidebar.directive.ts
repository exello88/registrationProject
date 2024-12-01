import { Directive, HostListener, OnInit } from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Directive({
  selector: '[appSidebar]'
})
export class SidebarDirective implements OnInit {

  constructor(private sidebarComponent: SidebarComponent) { }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  private checkScreenSize(): void {
    if (window.innerWidth < 600)
      this.sidebarComponent.smallScreen = true;
    else
      this.sidebarComponent.smallScreen = false;
  }
}
