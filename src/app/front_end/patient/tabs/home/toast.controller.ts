import { ToastController } from '@ionic/angular';

export class Toast {

    static toast

    constructor(private toastController: ToastController) {

    }

    async presentToast(message) {
        if(Toast.toast != undefined)
          Toast.toast.dismiss();
    
        Toast.toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        Toast.toast.present();
    }



}