import { environment } from '../../../../../../environments/environment';
import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, IonItemSliding} from '@ionic/angular';
import { Patient } from './patient.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestManagerService } from '../request-manager.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})

export class PatientListPage implements OnInit {

  public isFetching: boolean = true;

  public alertMessage;

  public doctor_coach_id;

  //la liste des patients
  public patientList: Patient[] = []; 

  //variable qui controle l'affichage de la barre de recherche
  public searchBarShown: boolean = false;

  //liste des patients selectionnes
  public patientListSelected: boolean[] = [false];

  //variable qui controle l'affichage des checkBox
  public checkZone: boolean = false;

  //variable qui controle le cochage ou nn de tous les checkBox 
  public checkAll: boolean = false;

  //le contenu de la barre de recherche
  public searchBarValue = '';

  //la valeur de routerLink
  public checkBoxWithRouter = 'patient-data';

  //liste des patients confirmés
  public confirmOrDemandList = true;

  constructor(private authService: AuthService, private requestManager: RequestManagerService,
    private alertController: AlertController, private http: HttpClient,
    private ngZone: NgZone) { }
  
  ngOnInit() {
    this.isFetching = true;
    this.requestManager.getPatientList()
    .subscribe(responsePatientList => {
      this.patientList = responsePatientList;
      console.log(this.patientList);

      this.isFetching = false;
    }, err => {
      this.isFetching = false;
    })
  }

  

  async acceptOrRejectPatientAlert(slide: IonItemSliding, patientIndex: number) {
      const alert = await this.alertController.create({
        backdropDismiss: true,
        header: 'Attention!',
        message: this.alertMessage,
        buttons: [
            {
              text: 'Yes',
              role: 'confirm',
              handler: () => {
                if(this.alertMessage == 'Please confirm the addition of the patient') {
                  this.acceptPatient(slide, patientIndex);
                  this.ngOnInit();
                }
                  
                else
                  this.rejectPatient(slide, patientIndex);
               },
            },
            {
              text: 'No',
              role: 'cancel'
            }
          ],
      });
      await alert.present();
  }
  
  change(checked, patientIndex) {
    this.patientListSelected[patientIndex] = checked;
  }

  supprimerPatients() {
    for(var i = 0; i < this.patientListSelected.length; i++)
    {
      if(this.patientListSelected[i] == true)
      {
        this.patientListSelected.splice(i, 1);
        this.patientList.splice(i, 1);
        i--;
      }
    }
    if(!this.atLeastOneConfirmed())
    {
      this.checkZone = false;
      this.checkAll = false;
    }
  }

  isChecked(): boolean {
    return this.patientListSelected.includes(true);
  }

  atLeastOneConfirmed() {

    return this.patientList.find(element => {
      return element.confirmed == true;
    })
  }

  changePatient_id(patient_id: string) {
    this.authService.otherId = patient_id;
  }

  acceptPatient(slide: IonItemSliding, patientIndex: number) {
    console.log(patientIndex);
    
    this.requestManager.acceptPatientRequest(this.patientList, patientIndex)
    .subscribe(response => {
      console.log(response);
      this.patientList[patientIndex].confirmed = true;
      slide.close();
      slide.disabled = true;
    })
    
    
  }

  rejectPatient(slide: IonItemSliding, patientIndex: number) {

    this.requestManager.rejectPatientRequest(this.patientList, patientIndex)
    .subscribe(response => {
      console.log(response);


      this.patientList.splice(patientIndex, 1);
    }, error => {


      console.log(error);
    })
  
    slide.close();
  }


  async presentAlertConfirm() {
    if(!this.isChecked())
    {
      const alert = await this.alertController.create({
        backdropDismiss: true,
        header: 'Attention!',
        message: "You have not selected anything",
        buttons: [
            {
              text: 'Ok',
              role: 'cancel',
              cssClass: 'danger',
            }, 
        ]
      });
      await alert.present();
    }
    else
    {
      const alert = await this.alertController.create({
        backdropDismiss: true,
        header: 'Attention!',
        message: 'Are you sure you want to delete a patient',
        buttons: [
          {
            text: 'Yes',
            role: 'confirm',
            cssClass: 'danger',
            handler: () => {
              this.onSubmitDeletePatients();
            }
            
          },
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'danger',
            handler: () => {
              this.checkAll = false;
            }
          }
        ]
      });
      await alert.present();
    }
  }


  onSubmitDeletePatients() {

    let idPatientListChecked: string[] = [];

    for(let i = 0; i < this.patientListSelected.length; i++) {
      if(this.patientListSelected[i]) {
        idPatientListChecked.push(this.patientList[i].patient._id);
      }
    }

    console.log(idPatientListChecked);


    this.http.post(
      environment.apiUrl + `/${this.authService.role}/deletePatient`, {
        id: this.authService.userId,
        patientIdList: idPatientListChecked
    }
    ).subscribe(response => {
      console.log(response);


      this.supprimerPatients();
    }, error => {


      console.log(error);
    })
  }  
}
