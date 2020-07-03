import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResetPassService } from './reset-pass.service';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {
  private email: string;
  private role: "patient" | "doctor" | "coach";
  private toast: any;

  constructor(
    private resetPassService: ResetPassService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    Plugins.Storage.get({ key: 'resetData' }).then(storedData => {
      if (storedData) {
        const parsedData = JSON.parse(storedData.value) as {
          email: string,
          role: "patient" | "doctor" | "coach"
        };
        if (parsedData) {
          this.email = parsedData.email;
          this.role = parsedData.role;
        }
      }
    }, err => {
      console.log(err);
      this.navCtrl.navigateRoot("/login");
    })
  }

  validateform(form: NgForm){
    if (form.invalid || (form.value.newpass != form.value.confirmnewpass)) {
      return true;
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid || form.value.newpass != form.value.confirmnewpass) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Saving Password...',
      spinner: 'circular'
    }).then(loadingElement => {
      this.resetPassService.sendPassword(this.email, this.role, form.value.newpass, form.value.code).subscribe(resData => {
        loadingElement.dismiss();
        this.navCtrl.navigateRoot("/login");
        Plugins.Storage.clear();
        if (this.toast) {
          this.toast.dismiss();
        }
        this.toastCtrl.create({
          message: resData.message,
          duration: 4000,
          position: "bottom"
        }).then(toastElement => {
          toastElement.present();
        });
      }, async err => {
        loadingElement.dismiss();
        if (this.toast) {
          this.toast.dismiss();
        }
        this.toast = await this.toastCtrl.create({
          message: err.error.message,
          duration: 4000,
          position: "bottom"
        });
        this.toast.present();
      });
    });
  }
}
