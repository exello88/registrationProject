import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { user } from 'src/app/session-data';
import { IComment, IUserInfo } from 'src/app/user-profile/profile.service';
import { ProfilePostComponent } from '../profile-post.component';

@Component({
  selector: 'app-profile-comments',
  templateUrl: './profile-comments.component.html',
  styleUrls: ['./profile-comments.component.scss']
})
export class ProfileCommentsComponent implements OnInit {
  @Input() comments: IComment[] = [];
  @Input() commentsToShow!: number;
  @Input() modalStatus!: boolean;
  @Input() smallScreen!: boolean;
  @Input() commentsShowStatus!: boolean;
  @Input() commentsModelShowStatus!: boolean;

  public showComments: IComment[] = [];
  public userInfo!: IUserInfo;
  public visibleComments!: number;

  @Output() replyName = new EventEmitter<string>();

  constructor(private profilePost: ProfilePostComponent) { }

  ngOnInit() {
    this.visibleComments = this.commentsToShow;
    this.updateDisplayedComments();
    if (user.userInfo)
      this.userInfo = user.userInfo;
  }

  private updateDisplayedComments(): void {
    if (this.smallScreen)
      this.showComments = this.comments.slice(0, this.comments.length);
    else
      this.showComments = this.comments.slice(0, this.visibleComments);
  }

  public loadMoreComments(): void {
    this.visibleComments += this.commentsToShow;
    this.updateDisplayedComments();
  }

  public changeCommentRepliesShow(comment: IComment): void {
    comment.showReplies = true;
  }

  public changeStatus() {
    this.commentsShowStatus = false;
    this.profilePost.commentsShowStatus = false;
    this.commentsModelShowStatus = false;
  }
}
