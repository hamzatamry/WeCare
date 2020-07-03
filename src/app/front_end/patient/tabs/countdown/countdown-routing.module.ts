import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountdownPage } from './countdown.page';

const routes: Routes = [
  {
    path: '',
    component: CountdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountdownPageRoutingModule {}
