import { forkJoin, map, Observable, of, Subject, Subscription, takeUntil, tap } from 'rxjs';
import { IResponse, IVkUserInfo, IUserInfo, ICount, IVKCity, ProfileService } from './profile.service';
import { HttpClient } from '@angular/common/http';
import { VKUrl } from '../environments';
import { Injectable, OnDestroy } from '@angular/core';
import { VKTokens } from '../session-data';

@Injectable({
  providedIn: 'platform',
})
export class UserInfoBuilder implements OnDestroy {
  private subscriptions$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private profileservise: ProfileService) { }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public buildUserData(): Observable<IUserInfo> {
    return this.getVkUserInfo().pipe(
      map((vkUserInfo) => this.processUserData(vkUserInfo))
    );
  }

  public buildUserActivities(): Observable<{ friendsCount: number; followersCount: number; subscriptionsCount: number }> {
    if (VKTokens.token && VKTokens.userId)
      return forkJoin([
        this.getFriendsCount(+VKTokens.userId, VKTokens.token),
        this.getFollowersCount(+VKTokens.userId, VKTokens.token),
        this.getSubscriptionsCount(+VKTokens.userId, VKTokens.token)
      ]).pipe(
        map(([friendsCount, followersCount, subscriptionsCount]) => ({
          friendsCount,
          followersCount,
          subscriptionsCount
        }))
      );
    else
      return of({ friendsCount: 0, followersCount: 0, subscriptionsCount: 0 });
  }

  private getVkUserInfo(): Observable<IVkUserInfo> {
    return this.http.jsonp<IResponse<IVkUserInfo[]>>(
      `${VKUrl}method/users.get?user_ids=${VKTokens.userId}&fields=relation,career,sex,photo_400_orig,cover,status,bdate,schools,city,education&access_token=${VKTokens.token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => response.response[0])
    );
  }

  private processUserData(vkUserInfo: IVkUserInfo): IUserInfo {
    forkJoin({
      schoolCityTitles: forkJoin(vkUserInfo.schools.map((school) => this.profileservise.getCityTitle(+school.city))),
      careerCityTitles: forkJoin(vkUserInfo.career.map((job) => this.profileservise.getCityTitle(job.city_id)))
    })
    .pipe(takeUntil(this.subscriptions$))
    .subscribe(({ schoolCityTitles, careerCityTitles }) => {
      for (let i = 0; i < schoolCityTitles.length; i++) {
        vkUserInfo.schools[i].cityTitle = schoolCityTitles[i];
      }

      for (let i = 0; i < careerCityTitles.length; i++) {
        vkUserInfo.career[i].cityTitle = careerCityTitles[i];
      }
    });

    return {
      id: vkUserInfo.id,
      name: `${vkUserInfo.first_name} ${vkUserInfo.last_name}`,
      photo: vkUserInfo.photo_400_orig,
      status: vkUserInfo.status,
      bdate: this.getFormateDate(vkUserInfo.bdate, 'DD.MM.YYYY'),
      career: vkUserInfo.career,
      cover: {
        url: vkUserInfo?.cover.original_image?.url,
        width: vkUserInfo?.cover.original_image?.width,
        height: vkUserInfo?.cover.original_image?.height,
      },
      schools: vkUserInfo.schools,
      universityName: vkUserInfo.university_name,
      city: vkUserInfo.city.title,
    };
  }

  private getFriendsCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<IResponse<ICount>>(
      `${VKUrl}method/friends.get?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getFollowersCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<IResponse<ICount>>(
      `${VKUrl}method/users.getFollowers?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getSubscriptionsCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<IResponse<{ groups: ICount }>>(
      `${VKUrl}method/users.getSubscriptions?user_id=${userId}&access_token=${token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => response.response.groups.count));
  }

  private getFormateDate(date: string, format: string) : string {
    try {
      return this.profileservise.formattedDate(date, format);
    } catch (error) {
      return date;
    }
  }
}

