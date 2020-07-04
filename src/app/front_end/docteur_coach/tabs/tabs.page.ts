import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LogOutComponent } from '../../patient/tabs/log-out/log-out.component';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public selectedPath = "";
  constructor(private popoverController: PopoverController,private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    })
   }

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
