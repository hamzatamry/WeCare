import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SampleCountdownPageRoutingModule } from './sample-countdown-routing.module';

import { SampleCountdownPage } from './sample-countdown.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SampleCountdownPageRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 75,
      "space": -10,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "var(--ion-color-primary)",
      "outerStrokeGradientStopColor": "var(--ion-color-secondary)",
      "outerStrokeGradient": true,
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "imageSrc": "",
      "imageHeight": 105,
      "imageWidth": 105,
      "animation": false,
      "showUnits": false,
      "showBackground": false,
      "responsive": true,
      "subtitleFontSize": "13",
      "titleFontSize": "20",
      "renderOnClick": false,
      "titleFontWeight": "700",
      "subtitleFontWeight": "700",
      "subtitleColor": "#777777",
      "maxPercent": 100
    })
  ],
  declarations: [SampleCountdownPage]
})
export class SampleCountdownPageModule {}
