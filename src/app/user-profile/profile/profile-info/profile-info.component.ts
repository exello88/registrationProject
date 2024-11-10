import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUserInfo, ProfileService } from '../../profile.service';
import { Subscription } from 'rxjs';

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

  private subscriptions!: Subscription;

  @Output() moreInfoActive = new EventEmitter<boolean>();

  constructor(private profileSevice: ProfileService) { }

  ngOnInit() {
    this.subscriptions = this.profileSevice.getUserActivities(this.userInfo.id, this.token).subscribe(count => {
      this.friendsCount = count.friendsCount;
      this.followersCount = count.followersCount;
      this.subscribeCount = count.subscriptionsCount;
    });
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
