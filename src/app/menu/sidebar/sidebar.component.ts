import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { sidebarItems } from 'src/app/environments';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarItems = sidebarItems;
  public smallScreen!: boolean;
  @Input() activeSidebar: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.smallScreen = true;
    }
  }
}