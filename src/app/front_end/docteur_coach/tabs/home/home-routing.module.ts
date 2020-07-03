import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AuthGuard } from '../../../../auth/auth.guard';
import { ProfileInputGuard } from '../../../../auth/profile-input/profile-input.guard';

const routes: Routes = 
[
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'patient-list',
    loadChildren: () => import('./patient-list/patient-list.module').then( m => m.PatientListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
