import { Component, Input, OnInit } from '@angular/core';
import { IComment, IPostPhoto } from 'src/app/user-profile/profile.service';
import { IAction } from '../../profile.component';
import { ProfilePostComponent } from '../profile-post.component';

const moreActions: IAction[] = [
  { title: 'Фоторедактор', icon: 'pi-chart-pie' },
  { title: 'Повернуть влево', icon: 'pi-arrow-circle-left' },
  { title: 'Повернуть вправо', icon: 'pi-arrow-circle-right' },
  { title: 'Указать место', icon: 'pi-map-marker' },
  { title: 'Добавить товар', icon: 'pi-shopping-bag' },
  { title: 'Открыть оригинал', icon: 'pi-download' }
]

@Component({
  selector: 'app-post-image',
  templateUrl: './post-image.component.html',
  styleUrls: ['./post-image.component.scss']
})
export class PostImageComponent {
  @Input() imgUrl!: IPostPhoto[]; 
  @Input() comments: IComment[] = [];
  @Input() date!: string; 
  @Input() avaUrl!: string; 
  @Input() name!: string; 
  @Input() smallScreen!: boolean; 
  public moreActions: IAction[] = moreActions;
  public inputText!: string;
  public showComments: boolean = false;

  constructor(private post: ProfilePostComponent) { }

  public changeActivitiesComponent() : void{
    this.post.fullScreenActivities = false;
  }

  public changeInputText(text: string) : void{
    this.inputText = text;
  }
}
