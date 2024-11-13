import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() avaUrl!: string;

  private activeSidebar = false;
  private subscriptions!: Subscription;


  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService) { }

  ngOnInit() {
    this.subscriptions = this.menuService.getSidebarActivities.subscribe((status) => {
      this.activeSidebar = status;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeActiveSidebar(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.menuService.setSidebarActivities = !this.activeSidebar;;
    }
  }
}
