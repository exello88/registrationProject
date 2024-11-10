import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  { path: 'authentication', loadChildren: () => import('./authorization/authorization.module').then(module => module.AuthorizationModule) },
  { path: 'user', loadChildren: () => import('./user-profile/user-profile.module').then(module => module.UserProfileModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
