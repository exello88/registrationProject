import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, Subscription, switchMap, timer } from 'rxjs';
import { VKTokens } from '../session-data';
import { minutDeclination, responseTime } from '../enum';

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

export interface IPosts {
  id: number,
  ownerID: number
  fromID: number,
  text: string,
  photoURL: {
    url: string,
    width: number
  }[],
  likeCount: number,
  repostsCount: number,
  commentsCount: number,
  date: string,
  isArchived: boolean,
  comment: IComment[]
}

export interface IPostsItems {
  allPosts: string,
  myPosts: string,
  archivePosts: string,
}

export interface IComment {
  id: number,
  date: string,
  text: IFromCommentText,
  fromId: number,
  ownerId: number,
  likes: number,
  replies?: IComment[],
  showReplies: boolean
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

export interface IVkPost {
  attachments: {
    type: string,
    photo?: IVkPhohto
  }[]
  id: number,
  from_id: number,
  owner_id: number,
  date: number,
  text: string,
  comments: ICount,
  likes: ICount,
  posts: ICount,
  reposts: ICount,
  views?: ICount,
  is_archived: boolean;
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

export interface IPostPhoto {
  url: string,
  width: number
}

export interface IVkComment {
  id: number,
  from_id: number,
  date: number,
  text: string,
  post_id: number,
  owner_id: number,
  likes: ICount,
  thread: ICount
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

export interface IResponse<T> {
  error: {
    error_code: number
  };
  response: T;
}

export interface ICount {
  count: number
}

export interface IDate {
  day: number,
  month: number,
  year: number
}

export interface IFromCommentText {
  from?: string,
  text: string
}

interface IVkPhohto {
  sizes: {
    height: number;
    width: number;
    url: string;
    type: string;
  }[];
  orig_photo: {
    height: number;
    width: number;
    url: string;
  };
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
      return `${date.day} ${this.getMonthName(date.month)} ${date.year}`;
  }

  public getCityTitle(cityId: number): Observable<string> {
    return this.getCityName(cityId).pipe(
      map((response) => {
        if (response.response.items && response.response.items.length > 0) {
          return response.response.items[0].title;
        }
        return '';
      })
    );
  }

  public formatVkDate(unixTime: number): string {
    const postDate = new Date(unixTime * 1000); 
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return responseTime.now;
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${this.getPlural(minutes, [minutDeclination.accusative, minutDeclination.genitive, minutDeclination.genitivePlural])} назад`;
    }

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    if (postDate >= todayStart) {
      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();
      const time = `${hours}:${minutes.toString().padStart(2, '0')}`;
      return `${responseTime.today} ${time}`;
    } else if (postDate >= yesterdayStart) {
      const hours = postDate.getHours();
      const minutes = postDate.getMinutes();
      const time = `${hours}:${minutes.toString().padStart(2, '0')}`;
      return `${responseTime.yesterday} ${time}`;
    }

    return postDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  public getComments(postId: number, ownerId: number): Observable<IVkComment[]> {
    return this.http.jsonp<IResponse<{ count: number; items: IVkComment[] }>>(
      `/vk-api/method/wall.getComments?owner_id=${ownerId}&post_id=${postId}&need_likes=1&count=10&access_token=${VKTokens.token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => {
        if (response && response.response && Array.isArray(response.response.items))
          return response.response.items;
        else
          return [];
      })
    );
  }

  public getCommentReplies(ownerId: number, commentId: number): Observable<IVkComment[]> {
    return this.http.jsonp<IResponse<{ count: number; items: IVkComment[] }>>(
      `/vk-api/method/wall.getComments?owner_id=${ownerId}&comment_id=${commentId}&extended=1&access_token=${VKTokens.token}&v=5.131`,
      'callback'
    ).pipe(
      map(response => response.response.items)
    );
  }


  public getLikes(ownerId: number, commentId: number): Observable<number> {
    return this.http.jsonp<IResponse<ICount>>(
      `/vk-api/method/likes.getList?type=comment&owner_id=${ownerId}&item_id=${commentId}&access_token=${VKTokens.token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    ).pipe(
      map(response => response.response.count)
    );
  }

  public checkUserLike(ownerId: number, postId: number): Observable<number> {
    return timer(3000).pipe(
      switchMap(() =>
        this.http.jsonp<IResponse<ICount>>(
          `/vk-api/method/likes.isLiked?type=post&owner_id=${ownerId}&item_id=${postId}&access_token=${VKTokens.token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
          'callback'
        )
      ),
      map(response => response.response.count)
    );
  }

  public parseCommentFrom(comment: string): IFromCommentText {
    const match = comment.match(/^\[id\d+\|([^\]]+)\],\s*(.*)$/);
    if (match)
      return { from: match[1], text: match[2] };

    return { text: comment };
  }


  private getPlural(n: number, forms: [string, string, string]): string {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 20) {
      return forms[2]; 
    }

    if (mod10 === 1) {
      return forms[0]; 
    }

    if (mod10 >= 2 && mod10 <= 4) {
      return forms[1]; 
    }

    return forms[2]; 
  }

  private getCityName(cityID: number): Observable<IResponse<IVKCity>> {
    return this.http.jsonp<IResponse<IVKCity>>(
      `/vk-api/method/database.getCities?city_ids=${cityID}&access_token=${VKTokens.token}&v=5.131&timestamp=${new Date().getTime()}&timestamp=${new Date().getTime()}`,
      'callback'
    );
  }

  private parseDate(dateString: string, format: string): IDate | false {
    const formatsIndex = format.split(/[^a-zA-Z]+/);
    const dateSplit = dateString.split(/[^0-9]+/);

    const formatMap: IDate = {
      day: formatsIndex.indexOf('DD'),
      month: formatsIndex.indexOf('MM'),
      year: formatsIndex.indexOf('YYYY'),
    };

    const datesIndex: IDate = {
      day: parseInt(dateSplit[formatMap.day]),
      month: parseInt(dateSplit[formatMap.month]),
      year: parseInt(dateSplit[formatMap.year])
    };

    return datesIndex;
  }

  private getMonthName(monthIndex: number): string {
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    return months[monthIndex - 1];
  }
}
