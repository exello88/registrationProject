import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSource } from 'src/app/environments';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  private token!: string;
  private userID!: string;


  constructor(private router: Router) { };

  ngOnInit() {
    this.initialURL();
  }

  private initialURL(): void {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let source = params.get('source');

    switch (source) {
      case AuthSource.vk:
        this.getTokenVK(hashParams);
        break;
      case AuthSource.ok:
        this.getTokenOK(params);
        break;
      default:
        this.router.navigate(['']);
        break;
    }

    if (!this.token)
      this.router.navigate(['']);
  }

  private getTokenVK(hashParams: URLSearchParams): void {
    let vkToken = hashParams.get('access_token');
    let vkUserID = hashParams.get('user_id');
    if (vkToken && vkUserID) {
      this.token = vkToken;
      this.userID = vkUserID;
    }
  }
  private getTokenOK(params: URLSearchParams): void {
    let okToken = params.get('code');
    if (okToken) {
      this.token = okToken;
    }
  }
}
