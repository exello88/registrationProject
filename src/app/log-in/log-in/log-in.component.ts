import { Component } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss', './media.scss']
})
export class LogInComponent {
  public rememberMe: boolean = false;

  public changeRememberMe() : void{
    this.rememberMe = !this.rememberMe;
  }
}
