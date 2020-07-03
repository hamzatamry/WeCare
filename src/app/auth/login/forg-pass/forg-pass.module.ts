import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgPassPageRoutingModule } from './forg-pass-routing.module';

import { ForgPassPage } from './forg-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgPassPageRoutingModule
  ],
  declarations: [ForgPassPage]
})
export class ForgPassPageModule {}
