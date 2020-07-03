import { take, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { AuthService } from './../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileInputGuard implements CanActivate {
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
          set: boolean
          expirationDate: string
        };
        if (state.url === "/profile-input") {
          if (!parsedData || (parsedData && parsedData.set)) {
            const path = this.authService.role === "patient" ? "patient" : "docteur_coach";
            this.navCtrl.navigateRoot(`${path}/home`);
            return false;
          }
          else if (parsedData && !parsedData.set)
            return true;
        }
        else {
          if (parsedData && parsedData.set) {
            return true;
          }
          else if (parsedData && !parsedData.set)
            this.navCtrl.navigateRoot("/profile-input");
            return false;
        }
      }
      return false;
    })
  }
}
