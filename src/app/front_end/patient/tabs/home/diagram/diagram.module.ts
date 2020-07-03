import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DiagramPageRoutingModule } from './diagram-routing.module';
import { ChartsModule } from 'ng2-charts';

import { DiagramPage } from './diagram.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagramPageRoutingModule,
    ChartsModule
  ],
  declarations: [DiagramPage]
})
export class DiagramPageModule {}
