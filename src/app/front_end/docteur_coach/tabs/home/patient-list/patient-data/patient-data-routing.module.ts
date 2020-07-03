import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientDataPage } from './patient-data.page';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ProfileInputGuard } from 'src/app/auth/profile-input/profile-input.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'diagram',
    pathMatch: 'full' 
  },
  {
    path: '',
    component: PatientDataPage,
    children: 
    [
      {
        path: 'physic',
        loadChildren: () => import('./physic/physic.module').then( m => m.PhysicPageModule),
      },
      {
        path: 'diagram',
        loadChildren: () => import('./diagram/diagram.module').then( m => m.DiagramPageModule),
      },
      {
        path: 'ordonnance/:fullName',
        loadChildren: () => import('./ordonnance/ordonnance.module').then( m => m.OrdonnancePageModule),
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientDataPageRoutingModule {}
