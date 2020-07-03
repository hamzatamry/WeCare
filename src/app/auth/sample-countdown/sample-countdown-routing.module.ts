import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SampleCountdownPage } from './sample-countdown.page';

const routes: Routes = [
  {
    path: '',
    component: SampleCountdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleCountdownPageRoutingModule {}
