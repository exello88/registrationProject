import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MenuModule } from '../menu/menu.module';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    userProfileRoutingModule,
    MenuModule
  ]
})
export class UserProfileModule { }
