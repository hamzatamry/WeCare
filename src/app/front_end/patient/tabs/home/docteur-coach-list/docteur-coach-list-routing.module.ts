import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocteurCoachListPage } from './docteur-coach-list.page';

const routes: Routes = [
  {
    path: '',
    component: DocteurCoachListPage
  },
  {
    path: 'ordonnance/:dcLastName/:dcFirstName',
    loadChildren: () => import('./ordonnance/ordonnance.module').then( m => m.OrdonnancePageModule)
  },
  {
    path: 'details',
    loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocteurCoachListPageRoutingModule {}
