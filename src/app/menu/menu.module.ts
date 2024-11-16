import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarDirective } from './sidebar/sidebar.directive';
import { TabbarComponent } from './tabbar/tabbar.component';
import { DropdownModule } from 'primeng/dropdown';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarDirective,
    TabbarComponent
  ],
  imports: [
    CommonModule,
    DropdownModule,
    AutoCompleteModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    TabbarComponent
  ]
})
export class MenuModule { }
