import { environment } from './../../../environments/environment';
import { AuthService } from './../auth.service';
import { ModalController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  @Input() email: string;
  @Input() password: string;
  @Input() role: 'patient' | 'doctor' | 'coach';
  private _canSend: boolean = true;
  private _sendTimeout: any;
  private interval: any;
  private _timeoutView: string;
  private countDownEnds: number;
  private toast: HTMLIonToastElement;

  constructor(
    private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  get canSend() {
    return this._canSend;
  }

  get timeoutView() {
    return this._timeoutView;
  }

  ngOnInit() {
    this.httpClient.get<{ resendTimeout?: Date }>(environment.apiUrl + `/user/timeout/${this.role}/${this.email}`)
    .subscribe(resData => {
      this.countDownEnds = (new Date(resData.resendTimeout)).getTime();
      const difference = this.countDownEnds - (new Date()).getTime();
      if (difference > 0) {
        this._canSend = false;
        this._sendTimeout = setTimeout(() => {
          this._canSend = true;
          clearTimeout(this._sendTimeout);
        }, difference);
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        this._timeoutView = "0" + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
        this.createCountdown();
      }
    }, err => {
      console.log(err);
    });
  }

  onCancel() {
    if (this.toast)
    {
      this.toast.dismiss();
    }
    if (this._sendTimeout) {
      clearTimeout(this._sendTimeout);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onResend() {
    if (!this._canSend) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Resending...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();
      this._canSend = false;
      this._sendTimeout = setTimeout(() => {
        this._canSend = true;
        clearTimeout(this._sendTimeout);
      }, 60000 * 5);
      this.countDownEnds = new Date().getTime() + 60000 * 5;
      this._timeoutView = "05:00";
      this.createCountdown();
      this.httpClient.post(environment.apiUrl + '/user/resend', { email: this.email, role: this.role })
      .subscribe(async () => {
        if (this.toast) {
          await this.toast.dismiss();
        }
        this.toast = await this.toastCtrl.create({
          message: "A code was sent. It may take a few minutes to be received.",
          duration: 4000,
          position: "bottom"
        });
        this.toast.present();
        loadingElement.dismiss();
      }, async err => {
        console.log(err);
        if (this.toast) {
          await this.toast.dismiss();
        }
        this.toast = await this.toastCtrl.create({
          message: "Failed to send another code. Please try again later.",
          duration: 4000,
          position: "bottom"
        });
        loadingElement.dismiss();
        this.toast.present();
      });
    });
  }

  onFormSubmit(form: NgForm) {
    this.loadingCtrl.create({
      message: 'Verifying...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();
      this.httpClient.post(environment.apiUrl + '/user/verify', { email: this.email, code: form.value.code, role: this.role })
      .subscribe(async () => {
        if (this.toast) {
          this.toast.dismiss();
        }
        if (this._sendTimeout) {
          clearTimeout(this._sendTimeout);
        }
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.authService.authenticate(this.email, this.password, this.role, "login").subscribe(() => {
            this.navCtrl.navigateRoot('/profile-input').then(() => {
              loadingElement.dismiss();
              this.modalCtrl.dismiss();
              this.toastCtrl.create({
                message: "Thank you! The account is now verified.",
                position: "bottom",
                duration: 4000
              }).then(toastElement => {
                toastElement.present();
              });
            });
        });
      }, async err => {
        if (this.toast) {
          await this.toast.dismiss();
        }
        this.toast = await this.toastCtrl.create({
          message: err.error.message,
          duration: 4000,
          position: "bottom"
        });
        loadingElement.dismiss();
        this.toast.present();
      });
    });
  }

  private createCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      const timeLeft = this.countDownEnds - new Date().getTime();
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      this._timeoutView = "0" + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
      if (timeLeft < 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
}