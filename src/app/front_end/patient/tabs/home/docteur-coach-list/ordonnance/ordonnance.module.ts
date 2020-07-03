import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdonnancePageRoutingModule } from './ordonnance-routing.module';

import { OrdonnancePage } from './ordonnance.page';
import { DetailsPageModule } from "../details/details.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdonnancePageRoutingModule,
    DetailsPageModule
  ],
  declarations: [OrdonnancePage]
})
export class OrdonnancePageModule {}
