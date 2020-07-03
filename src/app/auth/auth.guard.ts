import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private navCtrl: NavController) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.authStatusListener.pipe(take(1), switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return this.authService.autoLogin();
      }
      return of(isAuthenticated);
    }), tap(isAuthenticated => {
      if (!isAuthenticated) {
        this.navCtrl.navigateRoot('/welcome');
      }
    }));
  }
}
