import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'physic',
    loadChildren: () => import('./physic/physic.module').then( m => m.PhysicPageModule)
  },
  {
    path: 'diagram',
    loadChildren: () => import('./diagram/diagram.module').then( m => m.DiagramPageModule)
  },
  {
    path: 'docteur-coach-list',
    loadChildren: () => import('./docteur-coach-list/docteur-coach-list.module').then( m => m.DocteurCoachListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
