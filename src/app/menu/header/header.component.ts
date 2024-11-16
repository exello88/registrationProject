import { Component, Input } from '@angular/core';
import { ISidebarItem } from '../menu.service';

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
export class HeaderComponent{
  @Input() avaUrl!: string;
  @Input() id!: number;

  public moreActions : ISidebarItem[] = moreActions;
}
