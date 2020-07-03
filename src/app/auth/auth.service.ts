import { environment } from './../../environments/environment';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map, take } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userId: string;
  private _otherId: string;
  private _accessToken: string = null;
  private _authStatusListener = new BehaviorSubject<boolean>(false);
  private _role: 'patient' | 'doctor' | 'coach';
  private _email: string;
  private expiresIn: number;
  private tokenTimer: any;
  private toast: any;
  private _profileSetListener = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController,
    private oneSignal: OneSignal
  ) { }

  get email() {
    return this._email;
  }

  get userId() {
    return this._userId;
  }

  get token() {
    return this._accessToken;
  }

  get authStatusListener() {
    return this._authStatusListener.asObservable();
  }

  get role() {
    return this._role;
  }

  get profileSet() {
    return this._profileSetListener.asObservable();
  }

  get otherId() {
    return this._otherId;
  }

  set otherId(value) {
    this._otherId = value;
    const data = JSON.stringify({
      otherId: this._otherId
    });
    Plugins.Storage.set({ key: "selectedData", value: data });
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(take(1), map(storedData => {
      if (!storedData || !storedData.value) {
        return false;
      }
      const parsedData = JSON.parse(storedData.value) as {
        userId: string,
        email: string,
        token: string,
        role: 'patient' | 'doctor' | 'coach',
        set: boolean,
        expirationDate: string
      };
      const expirationDate = new Date(parsedData.expirationDate);
      if (expirationDate <= new Date()) {
        this.logout();
        return false;
      }
      this._accessToken = parsedData.token;
      this._email = parsedData.email;
      this._userId = parsedData.userId;
      this._role = parsedData.role;
      this.expiresIn = (expirationDate.getTime() - (new Date()).getTime()) / 1000;
      this._profileSetListener.next(parsedData.set);
      this._authStatusListener.next(true);
      const timeout = setTimeout(() => this.httpClient.post<{ message?: string, token?: string, expiresIn?: number }>(environment.apiUrl + '/user/token', { id: parsedData.userId, role: this.role }).subscribe(resData => {
        this._accessToken = resData.token;
        this.expiresIn = resData.expiresIn;
        this.storeAuthData(parsedData.email);
        clearTimeout(timeout);
        clearInterval(this.tokenTimer);
        this.tokenTimer = setInterval(() => {
          if (this.userId != parsedData.userId) {
            clearInterval(this.tokenTimer);
            return;
          }
          this.httpClient.post<{ message?: string, token?: string, expiresIn?: number }>(environment.apiUrl + '/user/token', { id: parsedData.userId, role: this.role }).subscribe(resData => {
            this._accessToken = resData.token;
            this.expiresIn = resData.expiresIn;
            this.storeAuthData(parsedData.email);
          }, err => {
            this.logout();
            this.toastCtrl.create({
              message: err.error.message,
              position: "bottom",
              duration: 4000
            }).then(toastElement => {
              if (this.toast) {
                this.toast.dismiss();
              }
              this.toast = toastElement;
              toastElement.present();
            });
          });
        }, (this.expiresIn - 30) * 1000);
      }, err => {
        clearTimeout(timeout);
        clearInterval(this.tokenTimer);
        this.logout();
        this.toastCtrl.create({
          message: err.error.message,
          position: "bottom",
          duration: 4000
        }).then(toastElement => {
          if (this.toast) {
            this.toast.dismiss();
          }
          this.toast = toastElement;
          toastElement.present();
          clearTimeout(timeout);
        });
      }), this.expiresIn * 1000);
      return true;
    }));
  }

  authenticate(
    email: string,
    password: string,
    role: 'patient' | 'doctor' | 'coach',
    requestType: 'login' | 'signup'
  ) {
    return this.httpClient.post<{ message?: string, id?: string, token?: string, expiresIn?: number, verified?: boolean, profileSet?: boolean }>(
    environment.apiUrl + `/user/${requestType}`, { email, password, role })
    .pipe(take(1), tap(resData => {
      this._accessToken = resData.token;
      if (this._accessToken) {
        this.oneSignal.setExternalUserId(resData.id.toString());
        this._email = email;
        this._userId = resData.id;
        this._role = role;
        this._authStatusListener.next(true);
        this.expiresIn = resData.expiresIn;
        this._profileSetListener.next(resData.profileSet);
        this.storeAuthData(email);
        clearInterval(this.tokenTimer);
        this.tokenTimer = setInterval(() => {
          if (this.userId != resData.id) {
            clearInterval(this.tokenTimer);
            return;
          }
          this.httpClient.post<{ message?: string, token?: string, expiresIn?: number }>(environment.apiUrl + '/user/token', { id: this.userId, role }).subscribe(resData => {
            this._accessToken = resData.token;
            this.expiresIn = resData.expiresIn;
            this.storeAuthData(email);
          }, err => {
            this.logout();
            this.toastCtrl.create({
              message: err.error.message,
              position: "bottom",
              duration: 4000
            }).then(toastElement => {
              if (this.toast) {
                this.toast.dismiss();
              }
              this.toast = toastElement;
              toastElement.present();
            });
          });
        }, (this.expiresIn - 30) * 1000);
      }
    }));
  }

  resetPasswordRequest(email: string, role: 'patient' | 'doctor' | 'coach') {
    return this.httpClient.post<{ message?: string }>(environment.apiUrl + '/user/resetRequest', { email, role }).pipe(take(1), tap(resData => {
      this._email = email;
      this._role = role;
      const data = JSON.stringify({
        email: email,
        role: role, 
      });
      Plugins.Storage.set({
        key: 'resetData',
        value: data
      });
    }));
  }

  logout() {
    this._userId = null;
    this._accessToken = null;
    this._authStatusListener.next(false);
    this._role = null;
    clearInterval(this.tokenTimer);
    this.tokenTimer = null;
    Plugins.Storage.clear().then(() => {
      if (!this.router.url.includes("/welcome") && !this.router.url.includes("/login") && !this.router.url.includes("/register"))
        this.navCtrl.navigateRoot("/login");
    });
  }

  private storeAuthData(email: string) {
    this.profileSet.pipe(take(1), tap(status => {
      const data = JSON.stringify({
        userId: this.userId,
        email: email,
        token: this.token,
        role: this.role,
        set: status, 
        expirationDate: new Date(new Date().getTime() + (this.expiresIn - 30) * 1000).toISOString()
      });
      Plugins.Storage.set({
        key: 'authData',
        value: data
      });
    })).subscribe();
  }
}
