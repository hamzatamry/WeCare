import { environment } from './../../../environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample-countdown',
  templateUrl: './sample-countdown.page.html',
  styleUrls: ['./sample-countdown.page.scss'],
})
export class SampleCountdownPage implements OnInit {

  private _originalWaitTime: number;

  private _timeoutView: string = "";

  private _timeLeft: number;

  private _percentage: number;

  interval: any;

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

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
      this.httpClient.get<{ message?: string, originalWaitTime?: number, waitTime?: number }>(environment.apiUrl + `/patient/sampleWaitTime/${this.authService.userId}`).subscribe(resData => {
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
      }, err => {
        console.log(err);
        this._timeoutView = "Unable to Take a Sample for Now"
        this._percentage = 0;
      });
    }
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
      console.log(this.percentage + " %")
      this._percentage = +((((this.originalWaitTime - this.timeLeft) / this.originalWaitTime) * 100).toFixed(2));
      this._timeoutView = (hours < 10 ? "0" : "") + hours + " : " + (minutes < 10 ? "0" : "") + minutes + " : " + (seconds < 10 ? "0" : "") + seconds;
      if (this.timeLeft < 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
}
