import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ISidebarItem, MenuService } from '../menu.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { user } from 'src/app/session-data';

const sidebarItems: ISidebarItem[] = [
  {
    imgClass: 'pi-user',
    text: 'Моя страница',
    hideOnSmallScreen: true
  },
  {
    imgClass: 'pi-globe',
    text: 'Новости',
    hideOnSmallScreen: true
  },
  {
    imgClass: 'pi-comment',
    text: 'Мессенджер',
    hideOnSmallScreen: true
  },
  {
    imgClass: 'pi-phone',
    text: 'Звонки'
  },
  {
    imgClass: 'pi-users',
    text: 'Друзья'
  },
  {
    imgClass: 'pi-id-card',
    text: 'Сообщества'
  },
  {
    imgClass: 'pi-image',
    text: 'Фотографии'
  },
  {
    imgClass: 'pi-play',
    text: 'Музыка'
  },
  {
    imgClass: 'pi-video',
    text: 'Видео',
    hideOnSmallScreen: true
  },
  {
    imgClass: 'pi-mobile',
    text: 'Игры'
  },
  {
    imgClass: 'pi-th-large',
    text: 'Сервисы'
  },
  {
    imgClass: 'pi-heart',
    text: 'Реакции'
  },
  {
    imgClass: 'pi-megaphone',
    text: 'реклама'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  @Input() activePage!: string;

  public avaUrl!: string;
  public name!: string;
  public sidebarItems: ISidebarItem[] = sidebarItems;
  public smallScreen!: boolean;
  public activeSidebar: boolean = false;

  private subscriptions$: Subject<void> = new Subject<void>();
  static smallScreen: boolean;

  constructor(private menuService: MenuService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    if (user.userInfo) {
      this.avaUrl = user.userInfo.photo;
      this.name = user.userInfo.name
    }

    this.getActiveSidebar();
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public changeSidebarActive(): void {
    this.menuService.setSidebarActivities = !this.activeSidebar;
  }

  public navigateToUser(event: Event): void {
    event.stopPropagation();
    this.changeSidebarActive();
    this.router.navigate(['/user']);
  }

  private getActiveSidebar(): void {
    this.menuService.getSidebarActivities
      .pipe(takeUntil(this.subscriptions$))
      .subscribe((status) => {
        this.activeSidebar = status;
        this.cdr.detectChanges();
      });
  }
}