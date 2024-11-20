import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit, OnDestroy {
  private activeSidebar: boolean = false;
  private subscriptions$: Subject<void> = new Subject<void>();
  constructor(private breakpointObserver: BreakpointObserver, private menuService: MenuService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getActiveSidebar();
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public changeActiveSidebar(): void {
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.menuService.setSidebarActivities = true;
    }
  }

  private getActiveSidebar(): void{
    this.menuService.getSidebarActivities
    .pipe(takeUntil(this.subscriptions$))
    .subscribe((status) => {
      this.activeSidebar = status;
      this.cdr.detectChanges();
    });
  }
}
