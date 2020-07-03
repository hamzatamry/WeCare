import { NavController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate{
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
        if (state.url.includes("patient/tabs")) {
          if (parsedData && parsedData.role === "patient") {
            return true;
          }
          else if (parsedData && parsedData.role !== "patient") {
            this.navCtrl.navigateRoot("/docteur_coach");
            return false;
          }
        }
        else if (state.url.includes("docteur_coach/tabs")) {
          if (parsedData && (parsedData.role === "doctor" || parsedData.role === "coach")) {
            return true;
          }
          if (parsedData && parsedData.role !== "doctor" && parsedData.role !== "coach")
            this.navCtrl.navigateRoot("/patient");
            return false;
        }
      }
      return false;
    })
  }


  
}
