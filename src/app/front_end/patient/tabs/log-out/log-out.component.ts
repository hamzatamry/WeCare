import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss'],
})
export class LogOutComponent implements OnInit {

  constructor(private popover:PopoverController, 
              private authService: AuthService) { }

  ClosePopover()
   {
    this.popover.dismiss();
   }

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.ClosePopover();
  }

}
