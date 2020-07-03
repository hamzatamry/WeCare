import { environment } from '../../../../../../../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, PopoverController, ToastController, NavController } from "@ionic/angular";
import { DetailsPage } from './details/details.page';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from "@ionic/angular";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../../../../auth/auth.service'
import { Plugins } from '@capacitor/core';
import { RequestManagerService } from '../../../request-manager.service';

@Component({
  selector: "app-ordonnance",
  templateUrl: "./ordonnance.page.html",
  styleUrls: ["./ordonnance.page.scss"],
})
export class OrdonnancePage implements OnInit {
  public patient_id;
  public doctor_coach_id;
  @ViewChild("content", { static: false }) public content: IonContent;

  public isFetching: boolean = false;
  public noDataFound : boolean = false;
  public today = new Date();
  public addPres: boolean = false;
  public drugName: string = "";
  public prescriptionDate: string = "";
  public patientFullName: string = '';
  private otherId: string;

  // objet a poster dans la bd
  public newPrescription: Prescription = {
    consultationDate: this.today,
    situation: null,
    medication: [],
    details: null,
  };

  public prescriptionsList: Prescription[] = [];

  constructor(
    public alertController: AlertController,
    public popoverController: PopoverController,
    public http: HttpClient,
    private authService: AuthService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    private requestManager: RequestManagerService
  ) {}

  ngOnInit() {
    Plugins.Storage.get({ key: "selectedData" }).then(storedData => {
      if (storedData) {
        const parsedData = JSON.parse(storedData.value) as {
          otherId: string;
        }
        if (parsedData) {
          this.otherId = parsedData.otherId;
          this.route.params.subscribe(element => {
            this.patientFullName = element['fullName'].split('_').join(' ');
            console.log(this.patientFullName);
          });
      
          this.isFetching = true;

         this.requestManager.getDoctorPrescriptionList(this.otherId)
          .subscribe((result: Prescription[]) => {
            console.log(result);
            result.forEach((ele) => {
              ele.consultationDate = new Date(ele.consultationDate);
            });
            this.prescriptionsList = result;
            this.isFetching = false;
            console.log("apres :", this.prescriptionsList);
            if (this.prescriptionsList.length <= 0)
              this.noDataFound = true;
          }, err => {
            this.isFetching = false;
          });
        }
        else {
          this.navCtrl.navigateBack("/docteur_coach/home/patient-list");
        }
      }
    }, err => {
      this.navCtrl.navigateBack("/docteur_coach/home/patient-list");
    });
  }

  async presentToast(message : string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  addPrescription() {

    
    this.http.post(
      environment.apiUrl + `/${this.authService.role}/prescription`,
      {
        id: this.authService.userId,
        otherId: this.otherId,
        prescription:this.newPrescription
      }
    ).subscribe(result =>{
        console.log(result);
        this.prescriptionsList.unshift(this.newPrescription);
        this.addPres = false;
        this.newPrescription = {
          consultationDate: this.today,
          situation: null,
          medication: [],
          details: null,
        };
        this.presentToast('Your prescription has been saved.');
      }, error => {
        this.presentToast('An error has occured.Please try again!');
        console.log(error);
      });
  }

  async addDrug() {
    if (this.drugName != "") {
      this.newPrescription.medication.unshift(this.drugName);
      this.drugName = "";
    } else {
      const alert = await this.alertController.create({
        header: "Warning!!",
        message: "Make sure you enter input in order to add it to the list!!!",
        buttons: [
          {
            text: "Okay",
          },
        ],
      });
      alert.present();
    }
  }

  removeDrug(index: number) {
    this.newPrescription.medication.splice(index, 1);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Confirm",
      message: "Are you sure you want to send this prescription !!!",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Okay",
          handler: () => {
            this.onSubmit();
            this.addPrescription();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentPrescription(index: number) {
    const popover = await this.popoverController.create({
      component: DetailsPage,
      componentProps: {
        custom_id: {
          prescription: this.prescriptionsList[index],
          patientName: this.patientFullName,
          index: index,
        },
      },
      cssClass: "prescription",
    });
    popover.onDidDismiss().then((result) => {
      if (result.data != undefined) {
        this.newPrescription = {
          ...this.prescriptionsList[result.data],
          consultationDate: this.today,
        };
        this.showAddCard();
      }
    });
    return await popover.present();
  }

  showAddCard() {
    this.addPres = true;
    this.content.scrollToTop();
  }

  showNewPresc() {
    this.addPres = !this.addPres;
    this.newPrescription = {
      consultationDate: this.today,
      situation: null,
      medication: [],
      details: null,
    };
    this.content.scrollToTop();
  }

  onSubmit() {
    console.log("submitted");
  }
}

export interface Prescription{
  consultationDate: Date,
  situation: string,
  medication: string[],
  details: string
}