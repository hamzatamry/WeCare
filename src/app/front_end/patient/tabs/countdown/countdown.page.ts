import { Component, OnInit } from '@angular/core';
import { RequestManagerService } from '../home/request-manager.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SimulationService, SampleSensorSent } from '../home/simulation.service';
import { HttpClient } from '@angular/common/http';
import { Toast } from '../home/toast.controller';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.page.html',
  styleUrls: ['./countdown.page.scss'],
})
export class CountdownPage implements OnInit {

  public playing:boolean = false;
  //la date actuelle 
  public actualDate: Date;

  //le jour choisit, il est initie au jour actuel en debut, c'est un indice
  public day;


  private _originalWaitTime: number;

  private _timeoutView: string = "";

  private _timeLeft: number;

  private _percentage: number;

  interval: any;

  private _isFetching: boolean = false;

  constructor(
    private requestManager: RequestManagerService,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private route: ActivatedRoute, 
    private simulationService: SimulationService, 
    private http: HttpClient) {
  }

  get isFetching() {
    return this._isFetching;
  }

  get timeoutView() {
    return this._timeoutView;
  }

  get timeLeft() {
    return this._timeLeft;
  }

  get percentage() {
    return this._percentage;
  }

  get originalWaitTime() {
    return this._originalWaitTime;
  }

  ngOnInit() {
    this._isFetching = true;
    this.actualDate = new Date();
    this.day = this.actualDate.getDay();
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    if (currentHour < 10) {
      const nextTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 10, 0, 0, 0);
      this._timeLeft = nextTime.getTime() - currentDate.getTime();
      this._originalWaitTime = 10 * 3600 * 1000;
      this._percentage = +((((this.originalWaitTime - this.timeLeft) / this.originalWaitTime) * 100).toFixed(2));
      const hours = Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
      this._timeoutView = (hours < 10 ? "0" : "") + hours + " : " + (minutes < 10 ? "0" : "") + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
      this.createCountdown();
    }
    else {
      this.http.get<{ message?: string, originalWaitTime?: number, waitTime?: number }>(environment.apiUrl + `/patient/sampleWaitTime/${this.authService.userId}`).subscribe(resData => {
        if (resData.waitTime) {
          this._timeLeft = resData.waitTime;
          this._originalWaitTime = resData.originalWaitTime;
          this._percentage = +((((this.originalWaitTime - this.timeLeft) / this.originalWaitTime) * 100).toFixed(2));
          const hours = Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
          this._timeoutView = (hours < 10 ? "0" : "") + hours + " : " + (minutes < 10 ? "0" : "") + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
          this.createCountdown();
        }
        else {
          this._timeoutView = "Press to Take a Sample";
          this._percentage = 100;
        }
      }, err => {;
        console.log(err);
        this._timeoutView = "Unable to Take a Sample for Now"
        this._percentage = 0;
      });
      console.log(this.timeLeft);
    }
  }

  sample() {

    

    this.simulationService.hasTakenSample = true;
    let sampleSensorSent: SampleSensorSent = this.simulationService.sampleSensorSentReturned();
      
    console.log(sampleSensorSent);

    this.requestManager.setPatientSensorData(sampleSensorSent, this.simulationService.normal)
    .subscribe(res => {
      
      this.ngOnInit();
      const currentDate = new Date();

      this.router.navigate(['/patient/tabs/home/diagram'])
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

  private createCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      const hours = Math.floor((this.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((this.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((this.timeLeft % (1000 * 60)) / 1000);
      this._timeLeft -= 1000;
      // console.log(this.percentage + " %")
      this._percentage = +((((this.originalWaitTime - this.timeLeft) / this.originalWaitTime) * 100).toFixed(2));
      this._timeoutView = (hours < 10 ? "0" : "") + hours + " : " + (minutes < 10 ? "0" : "") + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
      if (this.timeLeft < 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  noSample() {
    console.log("No sample will be taken");
  }
}
