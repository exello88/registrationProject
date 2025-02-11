import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IComment, IPosts, IVkComment, ProfileService } from '../../profile.service';
import { IAction, ProfileComponent } from '../profile.component';
import { delay, Observable, retryWhen, scan, Subject, takeUntil, takeWhile } from 'rxjs';


@Component({
  selector: 'app-profile-post',
  templateUrl: './profile-post.component.html',
  styleUrls: ['./profile-post.component.scss']
})
export class ProfilePostComponent implements OnInit, OnDestroy {
  @Input() postInfo !: IPosts;
  @Input() photo !: string;
  @Input() name !: string;
  public daleteActions: string[] = ['Удалить запись', 'Архивировать запись', 'Сохранить в закладах', 'Редактировать', 'Закрепить', 'Выключить комментарии'];
  public selectedAction: IAction = { title: '', icon: '' };
  public fullScreenActivities: boolean = false;
  public comments: IComment[] = [];
  public userLiked: boolean = false;
  public smallScreen: boolean = false;
  public commentsShowStatus: boolean = false;
  public moreActions: string[] = ['Сначала интересные', 'Сначала старые', 'Сначала новые'];

  private subscriptions$: Subject<void> = new Subject<void>();

  constructor(private profileService: ProfileService, private profile: ProfileComponent) { }

  ngOnInit() {
    this.getPostComment();
    this.checkUserLike();
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }

  private getPostComment(): void {
    this.profileService.getComments(this.postInfo.id, this.postInfo.ownerID).pipe(
      delay(3000)
    ).pipe(
      takeUntil(this.subscriptions$))
      .subscribe(vkComments => {
        new Observable(observer => {
          this.processVkComment(vkComments);
          observer.next(null); 
          observer.complete();  
        }).subscribe(() => this.profile.postsProcessed++);
      });
  }

  private checkUserLike(): void {
    this.profileService.checkUserLike(this.postInfo.ownerID, this.postInfo.id).pipe(
      delay(3000)
    ).pipe(
      takeUntil(this.subscriptions$))
      .subscribe((responce) => {
        if (responce === 1)
          this.userLiked = true;
      })
  }

  private processVkComment(vkComments: IVkComment[]): void {
    vkComments.forEach(comment => {
      let repliesComments: IComment[] = [];

      if (comment.thread && comment.thread.count > 0) {
        this.profileService.getCommentReplies(this.postInfo.ownerID, comment.id).pipe(
          delay(3000)
        ).pipe(
          takeUntil(this.subscriptions$))
          .subscribe((replies: IVkComment[]) => {
            replies.forEach((repliesComment) => {
              let replies = {
                id: repliesComment.id,
                date: this.profileService.formatVkDate(repliesComment.date),
                text: this.profileService.parseCommentFrom(repliesComment.text),
                fromId: repliesComment.from_id,
                ownerId: repliesComment.owner_id,
                likes: 0,
                showReplies: false
              }

              this.profileService.getLikes(repliesComment.owner_id, repliesComment.id).pipe(
                retryWhen(errors =>
                  errors.pipe(
                    scan((retryCount) => retryCount + 1, 0),
                    delay(3000),
                    takeWhile(retryCount => retryCount <= 3)
                  )
                )
              ).pipe(
                takeUntil(this.subscriptions$))
                .subscribe(likesCount => {
                  replies.likes = likesCount;
                  repliesComments.push(replies);
                });
            });
          })
      }

      this.comments.push({
        id: comment.id,
        date: this.profileService.formatVkDate(comment.date),
        text: this.profileService.parseCommentFrom(comment.text),
        fromId: comment.from_id,
        ownerId: comment.owner_id,
        likes: comment.likes.count,
        replies: repliesComments,
        showReplies: false
      });
    });
  }
}
