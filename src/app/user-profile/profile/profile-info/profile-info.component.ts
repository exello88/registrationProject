import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUserInfo, ProfileService } from '../../profile.service';
import { Subscription } from 'rxjs';
import { UserInfoBuilder } from '../../user-info.builder';
import { HttpClient } from '@angular/common/http';

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
    this.subscriptions = this.userInfoBuilder.buildUserActivities().subscribe(activities => {
      this.subscribeCount = activities.subscriptionsCount;
      this.followersCount = activities.followersCount;
      this.friendsCount = activities.friendsCount;

      this.activitiesAvailable = true;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public moreInfoActiveEmit(): void {
    this.moreInfoActive.emit(false);
  }
}
