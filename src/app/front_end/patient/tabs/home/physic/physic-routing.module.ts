import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhysicPage } from './physic.page';

const routes: Routes = [
  {
    path: '',
    component: PhysicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhysicPageRoutingModule {}
