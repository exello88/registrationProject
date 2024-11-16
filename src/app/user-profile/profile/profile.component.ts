import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSource } from 'src/app/enum';
import { IUserInfo, ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { UserInfoBuilder } from '../user-info.builder';
import { VKTokens } from 'src/app/session-data';

interface IAction {
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
  { title: 'Загружать изображение', icon: 'pi-image' },
  { title: 'Область отображения', icon: 'pi-clone' },
  { title: 'Удалить', icon: 'pi-trash' }
]

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public token!: string;
  public moreInfoActive: boolean = false;
  public userInfo!: IUserInfo;
  public friendsCount!: number;
  public followersCount!: number;
  public subscribeCount!: number;
  public moreActions: IAction[] = moreActions;
  public changeActions:IAction[] = changeActions;
  public selectedAction: IAction = { title: '', icon: '' };

  private userID!: string;
  private subscriptions!: Subscription;
  private userInfoBuilder: UserInfoBuilder = new UserInfoBuilder(this.http, this.profileSevice);

  constructor(private router: Router, private http: HttpClient, private profileSevice: ProfileService) { };

  ngOnInit() {
    if (VKTokens.token && VKTokens.userId) {
      this.token = VKTokens.token;
      this.userID = VKTokens.userId;
      this.getUser();
    }
    else
      this.initialURL();
  };

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public moreInfoActiveEmit(): void {
    this.moreInfoActive = false;
  }

  public changeActiveMoreInfo(): void {
    this.moreInfoActive = true;
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
      localStorage.setItem('VkToken', JSON.stringify({ token: this.token, userId: this.userID }));

      this.getUser();
    }
  }

  private getTokenOK(params: URLSearchParams): void {
    let okToken = params.get('code');
    if (okToken) {
      this.token = okToken;
    }
  }

  private getUser() : void {
    this.subscriptions = this.userInfoBuilder.buildUserData().subscribe(data => {
      this.userInfo = data;
    });
  }
}
