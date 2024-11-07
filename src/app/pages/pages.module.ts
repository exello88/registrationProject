import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page/page.component';
import { PagesRoutingModule } from './pages-routing.module';



@NgModule({
  declarations: [
    PageComponent,
    PageComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
