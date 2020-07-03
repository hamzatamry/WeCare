import { environment } from '../../../../../../../environments/environment';
import { Toast } from './../../toast.controller';
import { Plugins } from '@capacitor/core';
import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { DetailsPage } from "../details/details.page";
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Ordonnance } from './ordonnance.model';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RequestManagerService } from '../../request-manager.service';


@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.page.html',
  styleUrls: ['./ordonnance.page.scss'],
})
export class OrdonnancePage implements OnInit {

  public isFetching: boolean = true;

  public today
  public prescriptionDate : string = "";

  public dcIdentity;

  private otherId: string;

  public consultationDateForm: Date;
  public prescriptionsList: Ordonnance[];

  constructor(private authService: AuthService, 
    private requestManager: RequestManagerService,
    private popoverController : PopoverController,
    private http: HttpClient, private route: ActivatedRoute, private navCtrl: NavController) { 
    }

  ngOnInit() {
    this.isFetching = true;
    this.today = new Date();
    Plugins.Storage.get({ key: "selectedData" }).then(storedData => {
      if (storedData) {
        const parsedData = JSON.parse(storedData.value) as {
          otherId: string;
        }
        if (parsedData) {
          this.otherId = parsedData.otherId;
         
          this.requestManager.getPrescriptionList(this.otherId)
          .subscribe((responseData: Ordonnance[]) => {
            responseData.forEach(element  => {
            element.consultationDate = new Date(element.consultationDate);
            });
            this.prescriptionsList = responseData;
            this.isFetching = false;
          }, error => {
            this.isFetching = false;
          });
          this.route.params.subscribe(element => {
            this.dcIdentity = element['dcLastName'] + " " + element['dcFirstName'];
          }, err => {
            this.isFetching = false;
          });
        }
        else {
          this.navCtrl.navigateBack("/patient/home/docteur-coach-list");
        }
      }
    }, err => {
      this.navCtrl.navigateBack("/patient/home/docteur-coach-list");
    })
  }

  async presentPrescription(index: number) {
    const popover = await this.popoverController.create({
      component: DetailsPage,
      componentProps:{
        custom_id: {
          dcIdentity: this.dcIdentity,
          prescription: this.prescriptionsList[index]
        }
      },
      translucent: true,
      cssClass: 'prescription'
    });
    return await popover.present();
  }
}
