import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Platform, PopoverController } from '@ionic/angular';
import { LogOutComponent } from '../log-out/log-out.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private authService: AuthService,
    private platform: Platform,
    private popoverController: PopoverController) {}

  
  ngOnInit() {
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

}
