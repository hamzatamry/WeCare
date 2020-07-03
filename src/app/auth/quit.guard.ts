import { NavController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class QuitGuard implements CanActivate{
  constructor(private authService: AuthService, private navCtrl: NavController) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return Plugins.Storage.get({ key: 'authData' }).then(storedData => {
      if (storedData && storedData.value) {
        const parsedData = JSON.parse(storedData.value) as {
          userId: string,
          token: string,
          role: 'patient' | 'doctor' | 'coach',
          expirationDate: string
        };
        if (parsedData && parsedData.token && new Date() < new Date(parsedData.expirationDate)) {
          this.navCtrl.back();
          return false;
        }
        return true;
      }
      return true;
    })
  }
}
