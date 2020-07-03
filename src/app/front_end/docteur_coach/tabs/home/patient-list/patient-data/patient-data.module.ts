import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientDataPageRoutingModule } from './patient-data-routing.module';

import { PatientDataPage } from './patient-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientDataPageRoutingModule
  ],
  declarations: [PatientDataPage]
})
export class PatientDataPageModule {}
