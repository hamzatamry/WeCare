import { environment } from './../environments/environment';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Plugins, Capacitor, AppState, LocalNotificationRequest } from '@capacitor/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  scheduledNotifications: LocalNotificationRequest[];

  constructor(
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private platform: Platform,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen"))
        Plugins.SplashScreen.hide();
      if (this.platform.is("cordova")) {
        this.setupPush();
      }
      for (let i = 0; i < 7; i++) {
        this.scheduleDailyNotifications(year, month, day + i, i + 1);
      }
    });
  }

  private scheduleDailyNotifications(year: number, month: number, day: number, id: number) {
    Plugins.LocalNotifications.schedule({
      notifications: [
        {
          id: id,
          title: "Sensor Sample 10 AM Reminder",
          body: "The application is ready to take your sample. Please login and activate your sensors.",
          schedule: { at: new Date(year, month, day, 10, 0, 0, 0) }
        }
      ]
    });
  }

  getNotifications() {
    if (this.scheduledNotifications) {
      this.scheduledNotifications = null;
    }
    else {
      Plugins.LocalNotifications.getPending().then(res => {
        this.scheduledNotifications = res.notifications;
      });
    }
  }

  setupPush() {
    this.oneSignal.setLogLevel({ logLevel: 6, visualLevel: 0 });;
    this.oneSignal.startInit(environment.appId, environment.googleProjectNumber);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(data => {
      const title = data.payload.title;
      const msg = data.payload.body;
      const additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });
    this.oneSignal.handleNotificationOpened().subscribe(data => {
      const title = data.notification.payload.title;
      const msg = data.notification.payload.body;
      const additionalData = data.notification.payload.additionalData;
      this.showAlert(title, msg, additionalData.task);
    });
    this.oneSignal.endInit();
  }

  private async showAlert(title: string, msg: string, task: any) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `${task}`,
          handler: () => {
            // Routing logic
          }
        }
      ]
    });
    if (alert) {
      alert.present();
    }
  }

  ngOnInit() {
    if (!this.platform.is("desktop") && this.platform.is("hybrid")) {
      Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
    }
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService.autoLogin().pipe(take(1)).subscribe(success => {
        if (!success && Plugins.Storage.get({ key: "authData" })) {
          this.authService.logout();
        }
      })
    }
  }
}
