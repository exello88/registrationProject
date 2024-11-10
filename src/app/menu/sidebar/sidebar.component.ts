import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ISidebarItem, MenuService } from '../menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarItems : ISidebarItem[] = this.menuService.sidebarItems;
  public smallScreen!: boolean;
  @Input() activeSidebar: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private menuService : MenuService) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.smallScreen = true;
    }
  }

  public changeSidebarActive(){
    this.activeSidebar = false;
  }
}