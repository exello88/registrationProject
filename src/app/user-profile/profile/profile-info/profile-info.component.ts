import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IUserInfo } from '../../profile.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent {
  @Input() userInfo!: IUserInfo;
  @Input() token!: string;
  @Input() subscribeCount!: number;
  @Input() followersCount!: number;
  @Input() friendsCount!: number;

  @Output() moreInfoActive = new EventEmitter<boolean>();

  constructor() { }

  public moreInfoActiveEmit() : void {
    console.log(this.userInfo)
    this.moreInfoActive.emit(false);
  }
}
