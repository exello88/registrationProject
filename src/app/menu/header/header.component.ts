import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private activeSidebar = false;

  @Output() ActiveSidebarEmit = new EventEmitter<boolean>();

  constructor(private breakpointObserver: BreakpointObserver) { }

  public changeActiveSidebar(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.activeSidebar = !this.activeSidebar;
      this.ActiveSidebarEmit.emit(this.activeSidebar);
    }
  }
}
