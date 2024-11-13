import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { VKUrl } from '../environments';

export interface IUserInfo {
  id: number,
  name: string,
  cover: {
    url: string,
    width: number,
    height: number
  },
  career:
  {
    city_id: number,
    company: string,
    cityTitle?: string,
    from?: number,
    until?: number
  }[]
  photo: string,
  status: string,
  bdate: string,
  schools: {
    city: string,
    cityTitle?: string,
    id: number,
    name: string
  }[],
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
  career:
  {
    city_id: number,
    company: string,
    cityTitle?: string,
    from?: number,
    until?: number
  }[],
  cover: {
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
  schools: {
    city: string,
    cityTitle?: string,
    id: number,
    name: string
  }[],
  university_name: string,
  can_access_closed: boolean,
  is_closed: boolean
}
interface IVKCity {

  response: {
    count: number,
    items:
    {
      id: number,
      title: string,
      important?: number
    }[]
  }
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

  public getUserData(userId: string, token: string): Observable<IUserInfo> {
    return this.http.jsonp<{ response: IVkUserInfo[] }>(
      `${VKUrl}method/users.get?user_ids=${userId}&fields=relation,career,sex,photo_400_orig,cover,status,bdate,schools,city,education&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => this.processingOfUserActivities(response, token)));
  }

  public getUserActivities(userId: number, token: string): Observable<{ friendsCount: number, followersCount: number, subscriptionsCount: number }> {
    return forkJoin([
      this.getFriendsCount(userId, token),
      this.getFollowersCount(userId, token),
      this.getSubscriptionsCount(userId, token)
    ]).pipe(
      map(([friendsCount, followersCount, subscriptionsCount]) => ({
        friendsCount,
        followersCount,
        subscriptionsCount
      }))
    );
  }

  private getFriendsCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<{ response: { count: number } }>(
      `${VKUrl}method/friends.get?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getFollowersCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<{ response: { count: number } }>(
      `${VKUrl}method/users.getFollowers?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getSubscriptionsCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<{ response: { groups: { count: number } } }>(
      `${VKUrl}method/users.getSubscriptions?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(map(response => response.response.groups.count));
  }

  private processingOfUserActivities(response: { response: IVkUserInfo[] }, token: string): IUserInfo {
    let vkUserInfo: IVkUserInfo = response.response[0];
    console.log(vkUserInfo)
    let city: string = '';

    if (vkUserInfo.bdate !== '') {
      vkUserInfo.bdate = this.formatedDate(vkUserInfo.bdate);
    }

    if (vkUserInfo.city?.title)
      city = vkUserInfo.city.title

    if (vkUserInfo.career[0])
      this.subscriptions = this.getCityName(vkUserInfo.career[0]?.city_id, token).subscribe((cityNames: IVKCity) => {
        cityNames.response.items.forEach((city) => {
          vkUserInfo.career.forEach((jobs) => {
            if (city.id === jobs.city_id)
              jobs.cityTitle = city.title;
          });
        });
      });

    if (vkUserInfo.schools[0])
      this.subscriptions = this.getCityName(vkUserInfo.schools[0].id, token).subscribe((cityNames: IVKCity) => {
        cityNames.response.items.forEach((city) => {
          vkUserInfo.schools.forEach((schools) => {
            if (city.id === +schools.city)
              schools.cityTitle = city.title;
          });
        });
      });

    return {
      id: vkUserInfo.id,
      name: vkUserInfo.first_name + ' ' + vkUserInfo.last_name,
      photo: vkUserInfo.photo_400_orig,
      status: vkUserInfo.status,
      bdate: vkUserInfo.bdate,
      career: vkUserInfo.career,
      cover: {
        url: vkUserInfo?.cover.original_image?.url,
        width: vkUserInfo?.cover.original_image?.width,
        height: vkUserInfo?.cover.original_image?.height
      },
      schools: vkUserInfo.schools,
      universityName: vkUserInfo.university_name,
      city: city
    };
  }

  private getCityName(cityID: number, accessToken: string): Observable<IVKCity> {
    return this.http.jsonp<IVKCity>(
      `${VKUrl}method/database.getCities?city_ids=${cityID}&access_token=${accessToken}&v=5.131`,
      'callback'
    );
  }

  private formatedDate(date: string): string {
    const [day, month, year] = date.split('.').map(Number);
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return day + ' ' + months[month - 1] + ' ' + year;
  }
}
