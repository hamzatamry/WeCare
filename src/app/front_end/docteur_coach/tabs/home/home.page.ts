import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private authService: AuthService,
    private platform: Platform) {}

    
  
  
  ngOnInit() {
    
  }

  onLogout() {
    this.authService.logout();
    
    
  }

}
