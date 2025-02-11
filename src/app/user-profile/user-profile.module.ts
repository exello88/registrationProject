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
import { InputTextModule } from 'primeng/inputtext';
import { ProfilePostComponent } from './profile/profile-post/profile-post.component';
import { PostImageComponent } from './profile/profile-post/post-image/post-image.component';
import { ProfileCommentsComponent } from './profile/profile-post/profile-comments/profile-comments.component';
import { SliderDirective } from './profile/profile-post/slider.directive';
import { CheckSizeDirective } from './profile/check-size.directive';
import { ProgressSpinnerModule } from 'primeng/progressspinner';



@NgModule({
  declarations: [
    ProfileComponent,
    ProfileInfoComponent,
    ProfilePostComponent,
    PostImageComponent,
    ProfileCommentsComponent,
    SliderDirective,
    CheckSizeDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    userProfileRoutingModule,
    MenuModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    ProgressSpinnerModule
  ]
})
export class UserProfileModule { }
