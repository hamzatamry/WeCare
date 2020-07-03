import { RoleGuard } from './role.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { QuitGuard } from './auth/quit.guard';
import { AuthGuard } from './auth/auth.guard';
import { ProfileInputGuard } from './auth/profile-input/profile-input.guard';

const routes: Routes = 
[
  {
    path: '',
    redirectTo: 'patient',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule),
    canActivate: [QuitGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule),
    canActivate: [QuitGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule),
    canActivate: [QuitGuard]
  },
  {
    path: 'profile-input',
    loadChildren: () => import('./auth/profile-input/profile-input.module').then( m => m.ProfileInputPageModule),
    canActivate: [AuthGuard, ProfileInputGuard]
  },
  {
    path: 'patient',
    loadChildren: () => import('./front_end/patient/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuard, ProfileInputGuard, RoleGuard]
  },
  {
    path: 'docteur_coach',
    loadChildren: () => import('./front_end/docteur_coach/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuard, ProfileInputGuard, RoleGuard]
  }

]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard, QuitGuard, ProfileInputGuard, RoleGuard]
})
export class AppRoutingModule {}
