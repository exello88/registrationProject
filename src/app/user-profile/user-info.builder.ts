import { forkJoin, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { IResponse, IVkUserInfo, IUserInfo, ICount, IVKCity, ProfileService, IVkPost, IPosts, IPostPhoto, IVkComment, IComment } from './profile.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { VKTokens } from '../session-data';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'platform',
})
export class UserInfoBuilder implements OnDestroy {
  private subscriptions$: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private profileservise: ProfileService, private route: Router) { }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public buildUserData(): Observable<IUserInfo | null> {
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

  public buildPostActivities(): Observable<IPosts[]> {
    return this.getUserPosts().pipe(
      map((posts) => this.processUserPosts(posts))
    );
  }

  private getUserPosts(): Observable<IVkPost[]> {
    return this.http.jsonp<IResponse<{ count: number, items: IVkPost[] }>>(
      `/vk-api/method/wall.get?owner_id=${VKTokens.userId}&count=10&access_token=${VKTokens.token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(
      map(response => {
        if (response.error?.error_code === 5) 
          this.route.navigate(['/authentication']);
        return response.response.items
      })
    );
  }

  private getVkUserInfo(): Observable<IVkUserInfo> {
    return this.http.jsonp<IResponse<IVkUserInfo[]>>(
      `/vk-api/method/users.get?user_ids=${VKTokens.userId}&fields=relation,career,sex,photo_400_orig,cover,status,bdate,schools,city,education&access_token=${VKTokens.token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(
      map(response => {
        if (response.error?.error_code === 5) 
          this.route.navigate(['/authentication']);
        return response.response[0]
      })
    );
  }

  private processUserPosts(vkPosts: IVkPost[]): IPosts[] {
    let result: IPosts[] = [];

    vkPosts.forEach((post: IVkPost) => {
      const photoUrls: IPostPhoto[] = [];

      if (post.attachments)
        post.attachments.forEach((image) => {
          if (image.photo?.orig_photo?.url && image.photo?.orig_photo?.width)
            photoUrls.push({
              width: image.photo?.orig_photo?.width,
              url: image.photo?.orig_photo?.url
            });
        })


      result.push({
        id: post.id,
        ownerID: post.owner_id,
        fromID: post.from_id,
        text: post.text,
        likeCount: post.likes.count,
        commentsCount: post.comments.count,
        date: this.profileservise.formatVkDate(post.date),
        isArchived: post.is_archived,
        photoURL: photoUrls,
        repostsCount: post.reposts.count,
        comment: []
      });

    });
    return result;
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
      `/vk-api/method/friends.get?user_id=${userId}&access_token=${token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getFollowersCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<IResponse<ICount>>(
      `/vk-api/method/users.getFollowers?user_id=${userId}&access_token=${token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(map(response => response.response.count));
  }

  private getSubscriptionsCount(userId: number, token: string): Observable<number> {
    return this.http.jsonp<IResponse<{ groups: ICount }>>(
      `/vk-api/method/users.getSubscriptions?user_id=${userId}&access_token=${token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(
      map(response => response.response.groups.count));
  }

  private getFormateDate(date: string, format: string): string {
    try {
      return this.profileservise.formattedDate(date, format);
    } catch (error) {
      return date;
    }
  }
}

