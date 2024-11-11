import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISidebarItem, MenuService } from '../menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems: ISidebarItem[] = this.menuService.sidebarItems;
  public smallScreen!: boolean;
  public activeSidebar: boolean = false;

  private subscriptions!: Subscription;

  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.smallScreen = true;
    }

    this.subscriptions = this.menuService.getSidebarActivities().subscribe((status) => {
      this.activeSidebar = status;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeSidebarActive() {
    this.menuService.setSidebarActivities(!this.activeSidebar);
  }
}