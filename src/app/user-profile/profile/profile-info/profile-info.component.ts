import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUserInfo, ProfileService } from '../../profile.service';
import { Subject, takeUntil } from 'rxjs';
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

  private subscriptions$: Subject<void> = new Subject<void>();
  private userInfoBuilder: UserInfoBuilder = new UserInfoBuilder(this.http, this.profileSevice);

  @Output() moreInfoActive = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private profileSevice: ProfileService) { }

  ngOnInit() {
    this.getUserActivities();
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  public moreInfoActiveEmit(): void {
    this.moreInfoActive.emit(false);
  }

  private getUserActivities(): void {
    if (user.userActivities.followersCount !== null &&
      user.userActivities.friendsCount !== null &&
      user.userActivities.subscribeCount !== null) {
      this.followersCount = user.userActivities.followersCount;
      this.friendsCount = user.userActivities.friendsCount;
      this.subscribeCount = user.userActivities.subscribeCount;

      this.activitiesAvailable = true;
    }
    else
      this.userInfoBuilder.buildUserActivities()
        .pipe(takeUntil(this.subscriptions$))
        .subscribe(activities => {
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
}
