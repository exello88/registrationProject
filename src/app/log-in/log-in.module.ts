import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from './log-in/log-in.component';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LogInComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ImageModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule
  ],
  exports: [
    LogInComponent
  ]
})
export class LogInModule { }
