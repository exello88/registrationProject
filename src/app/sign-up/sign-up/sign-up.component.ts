import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', './media.scss']
})
export class SignUpComponent {
  public rememberMe: boolean = false;

  public changeRememberMe(): void {
    this.rememberMe = !this.rememberMe;
  }
}
