import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { VKUrl } from '../environments';
import { VKTokens } from '../session-data';

export interface IUserInfo {
  id: number,
  name: string,
  cover: ICover,
  career: IJobInfo[]
  photo: string,
  status: string,
  bdate: string,
  schools: ISchool[],
  universityName: string,
  city: string
}

export interface IVkUserInfo {
  id: number,
  first_name: string,
  last_name: string,
  bdate: string,
  photo_400_orig: string,
  status: string,
  city: {
    id: number,
    title: string
  },
  career: IJobInfo[],
  cover: IVkCover,
  schools: ISchool[],
  university_name: string,
  can_access_closed: boolean,
  is_closed: boolean
}

export interface IResponse<T> {
  response: T;
}

export interface IVKCity {
  count: number,
  items:
  {
    id: number,
    title: string,
    important?: number
  }[]
}

export interface IVkCover {
  enabled: number,
  images:
  {
    url: string,
    width: number,
    height: number
  }[],
  crop_params: {
    x: number,
    y: number,
    width: number,
    height: number
  },
  original_image: {
    url: string,
    width: number,
    height: number
  },
  photo_id: number
}

export interface ICover {
  url: string,
  width: number,
  height: number
}

export interface IJobInfo {
  city_id: number,
  company: string,
  cityTitle?: string,
  from?: number,
  until?: number
}

export interface ISchool {
  city: string,
  cityTitle?: string,
  id: number,
  name: string
}

export interface ICount {
  count: number
}

@Injectable({
  providedIn: 'root'
})

export class ProfileService implements OnDestroy {
  private subscriptions!: Subscription;

  constructor(private http: HttpClient) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public formattedDate(dateString: string, format: string): string {
    const date = this.parseDate(dateString, format);

    if (!date)
      throw new Error();
    else
      return `${date.getDate()} ${this.getMonthName(date.getMonth())} ${date.getFullYear()}`;
  }

  public getCityTitle(cityId: number): Observable<string> {
    return this.getCityName(cityId).pipe(
      map((response) => {
        if (response.response.items.length > 0) {
          return response.response.items[0].title;
        }
        return '';
      })
    );
  }

  private getCityName(cityID: number): Observable<IResponse<IVKCity>> {
    return this.http.jsonp<IResponse<IVKCity>>(
      `${VKUrl}method/database.getCities?city_ids=${cityID}&access_token=${VKTokens.token}&v=5.131`,
      'callback'
    );
  }
  
  private parseDate(dateString: string, format: string): Date | false {
    const formatsIndex = format.split(/[^a-zA-Z]+/);
    const dateSplit = dateString.split(/[^0-9]+/);

    const formatMap = {
      dayIndex : formatsIndex.indexOf('DD'),
      mounthIndex: formatsIndex.indexOf('MM'),
      yearIndex: formatsIndex.indexOf('YYYY'),
    };

    const datesIndex = {
      day : parseInt(dateSplit[formatMap.dayIndex]),
      month : parseInt(dateSplit[formatMap.mounthIndex]), 
      year : parseInt(dateSplit[formatMap.yearIndex])
    };

    return new Date(datesIndex.year, datesIndex.month, datesIndex.day);
  }

  private getMonthName(monthIndex: number): string {
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return months[monthIndex -1];
  }
}
