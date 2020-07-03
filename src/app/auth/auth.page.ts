import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthService } from './auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {
  private _isLogging: boolean = true;
  private enteredEmail: string;
  private enteredPassword: string;
  private enteredRole: 'patient' | 'doctor' | 'coach';

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  get isLogging() {
    return this._isLogging;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  validateform(form: NgForm){
    if (form.invalid || (form.value.role != "doctor" && form.value.role != "patient" && form.value.role != "coach")){
      return true;
    }
  }

  onSignSwitch(form: NgForm) {
    this._isLogging = !this._isLogging;
    if (!this.isLogging) {
      this.enteredEmail = form.value.email;
      this.enteredPassword = form.value.password;
      this.enteredRole = form.value.role;
      form.reset();
    }
    else {
      form.setValue({
        email: this.enteredEmail,
        password: this.enteredPassword,
        role: this.enteredRole
      });
      this.enteredEmail = null;
      this.enteredPassword = null;
      this.enteredRole = null;
    }
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const role = form.value.role;
    const requestType = this.isLogging ? 'login' : 'signup';
    this.loadingCtrl.create({
      message: this.isLogging ? 'Logging in...' : 'Signing up...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();
      this.authService.authenticate(email, password, role, requestType).subscribe(resData => {
        if (resData.verified) {
          loadingElement.dismiss();
          if (resData.profileSet) {
            if(role == 'patient')
              this.navCtrl.navigateRoot(`patient/home`);
            else
              this.navCtrl.navigateRoot('docteur_coach/home');
          }
          else {
            this.navCtrl.navigateRoot('/profile-input');
          }
        }
        else {
          this.modalCtrl.create({
            component: VerifyEmailComponent,
            componentProps: {
              'email': email,
              'password': password,
              'role': role
            }
          }).then(modalElement => {
            loadingElement.dismiss();
            modalElement.present();
          });
        }
      }, err => {
        console.log(err);
        loadingElement.dismiss();
        this.alertCtrl.create({
          header: 'An error has occured',
          message: err.error.message ? err.error.message : 'Failed to communicate with server. Please try again later...',
          buttons: ['Okay']
        }).then(alertElement => {
          alertElement.present();
        });
      });
    });
  }
}
