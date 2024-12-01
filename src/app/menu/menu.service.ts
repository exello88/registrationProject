import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ISidebarItem {
  imgClass: string,
  text: string,
  hideOnSmallScreen?: boolean
}

@Injectable({
  providedIn: 'root'
})

export class MenuService {
  private activeSidebar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  set setSidebarActivities(status: boolean) {
    this.activeSidebar$.next(status);
  }

  get getSidebarActivities(): Observable<boolean> {
    return this.activeSidebar$.asObservable();
  }
}
