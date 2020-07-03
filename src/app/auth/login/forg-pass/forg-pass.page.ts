import { ResetPassService } from './reset-pass/reset-pass.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forg-pass',
  templateUrl: './forg-pass.page.html',
  styleUrls: ['./forg-pass.page.scss'],
})
export class ForgPassPage implements OnInit {

  constructor(private navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
  }

  validateform(form: NgForm){
    if (form.invalid || (form.value.role != "doctor" && form.value.role != "patient" && form.value.role != "coach")){
      return true;
    }
  }

  goBack() {
    this.navCtrl.navigateRoot("/login");
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Sending Code...',
      spinner: 'circular'
    }).then(loadingElement => {   
      loadingElement.present();
      this.authService.resetPasswordRequest(form.value.email, form.value.role).subscribe(resData => {
        loadingElement.dismiss();
        this.toastCtrl.create({
          message: resData.message,
          duration: 4000,
          position: "bottom"
        }).then(toastElement => {
          toastElement.present();
        });
        this.navCtrl.navigateRoot("login/forg-pass/reset-pass");
      }, err => {
        loadingElement.dismiss();
        this.toastCtrl.create({
          message: err.error.message,
          duration: 4000,
          position: "bottom"
        }).then(toastElement => {
          toastElement.present();
        });
      });
    });
  }
}
