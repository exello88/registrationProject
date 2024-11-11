import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ISidebarItem {
      imgClass: string,
      text: string
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public sidebarItems : ISidebarItem[] = [
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
  private activeSidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor() { }

  public setSidebarActivities(status: boolean) : void {
    this.activeSidebar.next(status);
  }

  public getSidebarActivities() : Observable<boolean> {
    return this.activeSidebar.asObservable();
  }
}
