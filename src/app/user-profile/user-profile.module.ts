import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    userProfileRoutingModule
  ]
})
export class UserProfileModule { }
