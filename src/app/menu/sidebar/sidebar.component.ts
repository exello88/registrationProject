import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ISidebarItem, MenuService } from '../menu.service';
import { fromEvent, Subscription } from 'rxjs';

const sidebarItems: ISidebarItem[] = [
  {
    imgClass: 'pi-user',
    text: 'Моя страница'
  },
  {
    imgClass: 'pi-globe',
    text: 'Новости'
  },
  {
    imgClass: 'pi-envelope',
    text: 'Мессенджер'
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
    text: 'Видео'
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, OnDestroy {
  @Input() activePage!: string;

  public sidebarItems: ISidebarItem[] = sidebarItems;
  public smallScreen!: boolean;
  public activeSidebar: boolean = false;

  private subscriptions!: Subscription;

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.checkScreenSize();

    this.subscriptions = this.menuService.getSidebarActivities.subscribe((status) => {
      this.activeSidebar = status;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeSidebarActive(): void {
    this.menuService.setSidebarActivities = !this.activeSidebar;;
  }

  @HostListener('window:resize', ['$event'])
  private checkScreenSize(): void {
    if (window.innerWidth < 600)
      this.smallScreen = true;
    else
      this.smallScreen = false;
  }
}