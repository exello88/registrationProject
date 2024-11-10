import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AutoCompleteModule } from 'primeng/autocomplete';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    AutoCompleteModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ]
})
export class MenuModule { }
