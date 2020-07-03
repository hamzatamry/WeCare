import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DocteurCoachListPageRoutingModule } from './docteur-coach-list-routing.module';

import { DocteurCoachListPage } from './docteur-coach-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocteurCoachListPageRoutingModule,
  ],
  declarations: [DocteurCoachListPage]
})
export class DocteurCoachListPageModule {}
