import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSource } from 'src/app/enum';
import { IUserInfo, ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public token!: string;
  public activeSidebar: boolean = false;
  public moreInfoActive: boolean = false;
  public userInfo!: IUserInfo;

  private userID!: string;
  private subscriptions!: Subscription;

  constructor(private router: Router, private http: HttpClient, private profileSevice: ProfileService) { };

  ngOnInit() {
    this.initialURL();
  };

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public changeActiveSidebar(status: boolean): void {
    this.activeSidebar = status;
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

      this.subscriptions = this.profileSevice.getUserData(this.userID, this.token).subscribe((userInfo: IUserInfo) => {
        this.userInfo = userInfo;
      });
    }
  }

  private getTokenOK(params: URLSearchParams): void {
    let okToken = params.get('code');
    if (okToken) {
      this.token = okToken;
    }
  }
}
