import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { LoadingController, AlertController, NavController, ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { TermsComponent } from './terms/terms.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private authService: AuthService, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  validateform(form: NgForm){
    if (form.invalid || form.value.confirm != form.value.password){
      return true;
    }
  }

  goBack() {
    this.navCtrl.navigateRoot("/welcome");
  }

  showTerms() {
    this.modalCtrl.create({
      component: TermsComponent,
      showBackdrop: true
    }).then(modalElement => {
      modalElement.present();
    });
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid || form.value.confirm != form.value.password) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    const role = form.value.role;
    const requestType = 'signup';
    this.loadingCtrl.create({
      message: 'Signing up...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();
      this.authService.authenticate(email, password, role, requestType).subscribe(resData => {
        if (resData.verified) {
          loadingElement.dismiss();
          if (resData.profileSet) {
            if(role == 'patient') {
              this.navCtrl.navigateRoot('/patient');
            }

              
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
