import { environment } from '../../../../../environments/environment';
import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Toast } from '../home/toast.controller';
import { ToastController } from '@ionic/angular';
import { SimulationService, SampleSensorSent } from './simulation.service';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';
import { RequestManagerService } from './request-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 

  constructor(
    private requestManager: RequestManagerService,
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute, 
    private simulationService: SimulationService,
    private http: HttpClient) {
  }


  sample() {
    this.simulationService.hasTakenSample = true;
    let sampleSensorSent: SampleSensorSent = this.simulationService.sampleSensorSentReturned();
      
    console.log(sampleSensorSent);

    this.requestManager.setPatientSensorData(sampleSensorSent, this.simulationService.normal)
    .subscribe(res => {
      
      const currentDate = new Date();

      this.router.navigate(['diagram'], {relativeTo: this.route})
      .then(() => {
        const toastObject = new Toast(this.toastController);
        toastObject.presentToast('Your sample has been taken successfully.');
      });

      Plugins.LocalNotifications.schedule({
        notifications: [
          {
            id: 8,
            title: "Sensor Sample Reminder",
            body: "The application is ready to take your sample. Please login and make sure your sensors are working.",
            schedule: { at: new Date(+currentDate + res.waitTime * 3600 * 1000) }
          }
        ]
      });
      
    }, error => {
      console.log(error);
      const toastObject = new Toast(this.toastController);
      toastObject.presentToast('Your sample was not taken please check the state of your sensors or try later.');
    })
    this.simulationService.hasTakenSample = false;
  }

  onLogout() {
    this.authService.logout();
  }


  


  

}
