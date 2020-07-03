import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPassPage } from './reset-pass.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPassPageRoutingModule {}
