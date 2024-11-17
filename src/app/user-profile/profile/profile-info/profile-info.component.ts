import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUserInfo, ProfileService } from '../../profile.service';
import { Subscription } from 'rxjs';
import { UserInfoBuilder } from '../../user-info.builder';
import { HttpClient } from '@angular/common/http';
import { user } from 'src/app/session-data';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit, OnDestroy {
  @Input() userInfo!: IUserInfo;
  @Input() token!: string;
  public subscribeCount!: number;
  public followersCount!: number;
  public friendsCount!: number;
  public activitiesAvailable: boolean = false;

  private subscriptions!: Subscription;
  private userInfoBuilder: UserInfoBuilder = new UserInfoBuilder(this.http, this.profileSevice);

  @Output() moreInfoActive = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private profileSevice: ProfileService) { }

  ngOnInit() {
    if (user.userActivities.followersCount !== undefined &&
      user.userActivities.friendsCount !== undefined &&
      user.userActivities.subscribeCount !== undefined) {
      this.followersCount = user.userActivities.followersCount;
      this.friendsCount = user.userActivities.friendsCount;
      this.subscribeCount = user.userActivities.subscribeCount;

      this.activitiesAvailable = true;
    }
    else
      this.subscriptions = this.userInfoBuilder.buildUserActivities().subscribe(activities => {
        this.subscribeCount = activities.subscriptionsCount;
        this.followersCount = activities.followersCount;
        this.friendsCount = activities.friendsCount;
        user.userActivities = {
          followersCount: this.followersCount,
          friendsCount: this.friendsCount,
          subscribeCount: this.subscribeCount
        }

        this.activitiesAvailable = true;
      });
  }

  ngOnDestroy() {
    if (this.subscriptions)
      this.subscriptions.unsubscribe();
  }

  public moreInfoActiveEmit(): void {
    this.moreInfoActive.emit(false);
  }
}
