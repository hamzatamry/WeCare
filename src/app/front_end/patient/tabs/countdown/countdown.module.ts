import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountdownPageRoutingModule } from './countdown-routing.module';

import { CountdownPage } from './countdown.page';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountdownPageRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      space: -10,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#2365d6",
      innerStrokeColor: "#e6e6e6",
      outerStrokeGradientStopColor: "#50c8ff",
      outerStrokeGradient: true,
      animationDuration: 300,
      imageSrc: "",
      imageHeight: 105,
      imageWidth: 105,
      animation: false,
      showUnits: false,
      showBackground: false,
      responsive: true,
      subtitleFontSize: "13",
      titleFontSize: "20",
      renderOnClick: false,
      titleFontWeight: "700",
      subtitleFontWeight: "700",
      subtitleColor: "#2365d6",
      maxPercent: 100
    })
  ],
  declarations: [CountdownPage]
})
export class CountdownPageModule {}
