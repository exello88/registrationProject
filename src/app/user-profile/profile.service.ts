import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

export interface IUserInfo {
  id: number,
  name: string,
  photo: string,
  status: string,
  bdate: string,
  education: string,
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
  schools: {
    city: string,
    id: number,
    name: string
  }[],
  university_name: string,
  can_access_closed: boolean,
  is_closed: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  public getUserData(userId: string, token: string): Observable<IUserInfo> {
    return this.http.jsonp<{ response: IVkUserInfo[] }>(
      `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_400_orig,status,bdate,schools,city,education&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => {
        let vkUserInfo: IVkUserInfo = response.response[0];
        let institutionName: string = this.getEducationName(vkUserInfo.university_name, vkUserInfo.schools);
        let city: string;

        if (vkUserInfo.bdate !== '') {
          vkUserInfo.bdate = this.formatedDate(vkUserInfo.bdate);
        }

        if (!vkUserInfo.city?.title)
          city = ''
        else
          city = vkUserInfo.city.title

        return {
          id: vkUserInfo.id,
          name: vkUserInfo.first_name + ' ' + vkUserInfo.last_name,
          photo: vkUserInfo.photo_400_orig,
          status: vkUserInfo.status,
          bdate: vkUserInfo.bdate,
          education: institutionName,
          city: city
        };
      }));
  }

  public getUserActivities(userId: number, token: string): Observable<{ friendsCount: number, followersCount: number, subscriptionsCount: number }> {
    return forkJoin([
      this.http.jsonp<{ response: { count: number } }>(
        `https://api.vk.com/method/friends.get?user_id=${userId}&access_token=${token}&v=5.131`,
        'callback'
      ).pipe(map(response => response.response.count)),

      this.http.jsonp<{ response: { count: number } }>(
        `https://api.vk.com/method/users.getFollowers?user_id=${userId}&access_token=${token}&v=5.131`,
        'callback'
      ).pipe(map(response => response.response.count)),

      this.http.jsonp<{ response: { users: { count: number, items: number[] }, groups: { count: number, items: number[] } } }>(
        `https://api.vk.com/method/users.getSubscriptions?user_id=${userId}&access_token=${token}&v=5.131`,
        'callback'
      ).pipe(map(response => response.response.groups.count))
    ]).pipe(
      map(([friendsCount, followersCount, subscriptionsCount]) => ({
        friendsCount,
        followersCount,
        subscriptionsCount
      }))
    );
  }

  private getEducationName(universityName: string, schools: { name: string }[]): string {
    if (universityName !== '')
      return universityName;
    else if (schools && schools.length > 0 && schools[0].name !== '')
      return schools[0].name;
    else {
      return '';
    }
  }

  private formatedDate(date: string): string {
    const [day, month, year] = date.split('.').map(Number);
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return day + ' ' + months[month - 1] + ' ' + year;
  }
}
