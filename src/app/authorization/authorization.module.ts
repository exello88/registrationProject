import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginWithComponent } from './login-with/login-with.component';



@NgModule({
  declarations: [
    LogInComponent,
    SignUpComponent,
    LoginWithComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    AuthenticationRoutingModule,
    ImageModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ]
})
export class AuthorizationModule { }
