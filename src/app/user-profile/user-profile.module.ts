import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userProfileRoutingModule } from './user-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { MenuModule } from '../menu/menu.module';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileInfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    userProfileRoutingModule,
    MenuModule,
    ButtonModule,
    DropdownModule
  ]
})
export class UserProfileModule { }
