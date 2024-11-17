import { Component, OnInit } from '@angular/core';
import { ISidebarItem } from '../menu.service';
import { user } from 'src/app/session-data';

const moreActions: ISidebarItem[] = [
  { text: 'Редактировать профиль', imgClass: 'pi-user' },
  { text: 'Изменить обложку', imgClass: 'pi-pencil' },
  { text: 'Скопировать ссылку', imgClass: 'pi-copy' },
  { text: 'Поделиться профилем', imgClass: 'pi-arrow-up-right' },
  { text: 'Мои вопросы', imgClass: 'pi-comment' },
  { text: 'Воспоминания', imgClass: 'pi-history' },
  { text: 'Мои желания', imgClass: 'pi-heart' },
  { text: 'Денежные переводы', imgClass: 'pi-id-card' }
]

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public scrollWatcher: boolean = false;
  public avaUrl!: string;
  public id!: number;
  public moreActions: ISidebarItem[] = moreActions;

  ngOnInit() {
    if (user.userInfo) {
      this.avaUrl = user.userInfo.photo;
      this.id = user.userInfo.id
    }
  }
}
