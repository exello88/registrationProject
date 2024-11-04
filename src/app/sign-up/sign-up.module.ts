import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SignUpComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ImageModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ],
  exports:[
    SignUpComponent
  ]
})
export class SignUpModule { }
