import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagramPage } from './diagram.page';

const routes: Routes = [
  {
    path: '',
    component: DiagramPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagramPageRoutingModule {}
