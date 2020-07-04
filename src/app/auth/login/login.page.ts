import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, NavController, ModalController } from '@ionic/angular';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  constructor(private authService: AuthService, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.navigateRoot("/welcome");
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const role = form.value.role;
    const requestType = 'login';
    this.loadingCtrl.create({
      message: 'Logging in...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();
      this.authService.authenticate(email, password, role, requestType).subscribe(resData => {
        if (resData.verified) {
          loadingElement.dismiss();
          if (resData.profileSet) {
            if(role == 'patient')
              this.navCtrl.navigateRoot('/patient');
            else
              this.navCtrl.navigateRoot('/docteur_coach');
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
