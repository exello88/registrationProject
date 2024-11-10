import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MenuModule } from '../menu/menu.module';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileInfoComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,
    userProfileRoutingModule,
    MenuModule
  ]
})
export class UserProfileModule { }
