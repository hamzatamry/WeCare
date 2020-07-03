import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgPassPage } from './forg-pass.page';

const routes: Routes = [
  {
    path: '',
    component: ForgPassPage
  },
  {
    path: 'reset-pass',
    loadChildren: () => import('./reset-pass/reset-pass.module').then( m => m.ResetPassPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgPassPageRoutingModule {}
