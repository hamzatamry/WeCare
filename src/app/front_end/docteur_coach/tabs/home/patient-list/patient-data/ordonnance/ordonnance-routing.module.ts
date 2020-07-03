import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdonnancePage } from './ordonnance.page';

const routes: Routes = [
  {
    path: '',
    component: OrdonnancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdonnancePageRoutingModule {}
