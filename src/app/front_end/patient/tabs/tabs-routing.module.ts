import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ProfileInputGuard } from 'src/app/auth/profile-input/profile-input.guard';
import { RoleGuard } from 'src/app/role.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'countdown',
        loadChildren: () => import('../../patient/tabs/countdown/countdown.module').then( m => m.CountdownPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../../patient/tabs/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./home/profil/profil.module').then( m => m.ProfilPageModule),
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
