import { ChangeDetectorRef, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ISidebarItem, MenuService } from '../menu.service';
import { fromEvent, Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  @Input() activePage!: string;
  @Input() avaUrl!: string;
  @Input() name!: string;

  public sidebarItems: ISidebarItem[] = sidebarItems;
  public smallScreen!: boolean;
  public activeSidebar: boolean = false;

  private subscriptions!: Subscription;
  static smallScreen: boolean;

  constructor(private menuService: MenuService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.subscriptions = this.menuService.getSidebarActivities.subscribe((status) => {
      this.activeSidebar = status;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeSidebarActive(): void {
    this.menuService.setSidebarActivities = !this.activeSidebar;;
  }

  public navigateToUser(event : Event) : void {
    event.stopPropagation(); 
    this.changeSidebarActive();
    this.router.navigate(['/user']);
  }
}