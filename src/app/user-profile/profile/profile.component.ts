import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthSource, localStorageKeys, VkPostMenuItems } from 'src/app/enum';
import { IPosts, IPostsItems, IUserInfo, ProfileService } from '../profile.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UserInfoBuilder } from '../user-info.builder';
import { user, VKTokens } from 'src/app/session-data';

export interface IAction {
  title: string,
  icon: string
}

const moreActions: IAction[] = [
  { title: 'Мои вопросы', icon: 'pi-comment' },
  { title: 'Воспоминания', icon: 'pi-history' },
  { title: 'Мои желания', icon: 'pi-heart' },
  { title: 'Денежные переводы', icon: 'pi-id-card' }
]

const changeActions: IAction[] = [
  { title: 'Загрузить изображение', icon: 'pi-image' },
  { title: 'Область отображения', icon: 'pi-clone' },
  { title: 'Удалить', icon: 'pi-trash' }
]

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public moreActions: IAction[] = moreActions;
  public changeActions: IAction[] = changeActions;
  public postsToShow!: IPosts[];
  public selectedAction: IAction = { title: '', icon: '' };
  public postsItems!: IPostsItems;
  public userInfo!: IUserInfo;
  public token!: string;
  public activePostsItem!: string;
  public inputSerchText!: string;
  public moreInfoActive: boolean = false;
  public postsInputActive: boolean = true;
  public postsProcessed: number = 0;

  private userID!: string;
  private posts!: IPosts[];
  private subscriptions$: Subject<void> = new Subject<void>();
  private userInfoBuilder: UserInfoBuilder = new UserInfoBuilder(this.http, this.profileSevice, this.route);

  constructor(private router: Router, private http: HttpClient, private profileSevice: ProfileService, private route: Router) { };

  ngOnInit() {
    this.postsItems = VkPostMenuItems;
    this.checkUserToken();
  };

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public moreInfoActiveEmit(): void {
    this.moreInfoActive = false;
  }

  public changeActiveMoreInfo(): void {
    this.moreInfoActive = true;
  }

  public changeModePostsAll(): void {
    if (this.postsInputActive) {
      this.activePostsItem = this.postsItems.allPosts;
      this.postsToShow = this.posts;
    }
  }

  public changeModePostsMy(): void {
    this.activePostsItem = this.postsItems.myPosts;
    this.postsToShow = [];
    this.posts.forEach((post: IPosts) => {
      if (post.fromID === +this.userID)
        this.postsToShow.push(post)
    })
  }

  public changeModePostsArchived(): void {
    this.activePostsItem = this.postsItems.archivePosts;
    this.postsToShow = [];
    this.posts.forEach((post: IPosts) => {
      if (post.isArchived)
        this.postsToShow.push(post)
    })
  }

  public searchPosts(): void {
    let searchPosts: IPosts[] = [];
    this.postsToShow.forEach((post: IPosts) => {
      if (post.text.includes(this.inputSerchText))
        searchPosts.push(post)
    })
    this.postsToShow = searchPosts;
  }

  private checkUserToken(): void {
    if (VKTokens.token && VKTokens.userId) {
      this.token = VKTokens.token;
      this.userID = VKTokens.userId;
      if (!user.userInfo)
        this.getUser();
      else
        this.userInfo = user.userInfo;
    }
    else
      this.initialURL();
  }

  private initialURL(): void {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let source = params.get('source');

    switch (source) {
      case AuthSource.vk:
        this.getTokenVK(hashParams);
        break;
      case AuthSource.ok:
        this.getTokenOK(params);
        break;
      default:
        this.router.navigate(['']);
        break;
    }

    if (!this.token)
      this.router.navigate(['']);
  }

  private getTokenVK(hashParams: URLSearchParams): void {
    let vkToken = hashParams.get('access_token');
    let vkUserID = hashParams.get('user_id');
    if (vkToken && vkUserID) {
      this.token = vkToken;
      this.userID = vkUserID;

      VKTokens.token = this.token;
      VKTokens.userId = this.userID;
      localStorage.setItem(localStorageKeys.vkTokens, JSON.stringify({ token: this.token, userId: this.userID }));

      this.getUser();
    }
  }

  private getTokenOK(params: URLSearchParams): void {
    let okToken = params.get('code');
    if (okToken) {
      this.token = okToken;
    }
  }

  private getUser(): void {
    forkJoin([
      this.userInfoBuilder.buildUserData(),
      this.userInfoBuilder.buildPostActivities()
    ]).pipe(
      takeUntil(this.subscriptions$)
    ).subscribe(
      ([userData, postActivities]) => {
        if (userData)
          this.userInfo = userData;
        this.posts = postActivities;
        this.activePostsItem = this.postsItems.allPosts;
        this.postsToShow = this.posts;
        user.userInfo = this.userInfo;
      }
    );
  }
}
