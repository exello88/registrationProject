import { Component, OnInit } from '@angular/core';
import { VKTokens } from './session-data';
import { localStorageKeys } from './enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'registrationProject';

  ngOnInit() {
    let VkToken = localStorage.getItem(localStorageKeys.vkTokens);

    if (VkToken) {
      const parsedVkToken = JSON.parse(VkToken);
      VKTokens.token = parsedVkToken.token;
      VKTokens.userId = parsedVkToken.userId;
    }
  }
}
