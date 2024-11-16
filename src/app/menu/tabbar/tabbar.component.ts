import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit, OnDestroy {
  private activeSidebar: boolean = false;
  private subscriptions!: Subscription;
  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions = this.menuService.getSidebarActivities.subscribe((status) => {
      this.activeSidebar = status;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeActiveSidebar(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.menuService.setSidebarActivities = !this.activeSidebar;
    }
  }
}
