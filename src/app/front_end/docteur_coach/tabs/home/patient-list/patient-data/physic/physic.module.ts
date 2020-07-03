import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhysicPageRoutingModule } from './physic-routing.module';

import { PhysicPage } from './physic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhysicPageRoutingModule
  ],
  declarations: [PhysicPage]
})
export class PhysicPageModule {}
