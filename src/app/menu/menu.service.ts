import { Injectable } from '@angular/core';

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
  
  constructor() { }
}
