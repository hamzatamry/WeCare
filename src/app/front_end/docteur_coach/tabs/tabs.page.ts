import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LogOutComponent } from '../../patient/tabs/log-out/log-out.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(public popoverController: PopoverController) { }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LogOutComponent,
      cssClass: 'popover-class',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  ngOnInit() {
  }
}
