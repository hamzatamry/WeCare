import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientListPage } from './patient-list.page';

const routes: Routes = [
  {
    path: '',
    component: PatientListPage
  },
  {
    path: 'patient-data/:patientLastName/:patientFirstName',
    loadChildren: () => import('./patient-data/patient-data.module').then( m => m.PatientDataPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientListPageRoutingModule {}
