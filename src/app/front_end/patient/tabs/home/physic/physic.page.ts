import { environment } from '../../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Diseases, Handicaps } from '../../../../../selectionList';
import { Physic } from './physic.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastController } from '@ionic/angular';
import { Toast } from '../toast.controller';
import { Router } from '@angular/router';
import { RequestManagerService } from '../request-manager.service';

@Component({
  selector: 'app-physic',
  templateUrl: './physic.page.html',
  styleUrls: ['./physic.page.scss'],
})
export class PhysicPage implements OnInit {

  public isFetching: boolean = true;
  public diseases = Diseases.list;
  public handicaps = Handicaps.list;
  public dataSanitaire: Physic = {};
  public physicOrMedical = true;
  public noEditing: boolean = true;

  constructor(
    private requestManager: RequestManagerService,
    private authService: AuthService, private http: HttpClient,
    private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.isFetching = true;


    this.requestManager.getPatientPhysMedData()
    .subscribe(response => {
      console.log(response);
      this.dataSanitaire = response;
      this.isFetching = false;
    });
  }

  onSubmit() {
    
    console.log({
      id: this.authService.userId, 
      data: this.dataSanitaire
    });

    this.requestManager.setPatientPhysMedData(this.dataSanitaire)
    .subscribe(response => {
      console.log(response);
      this.router.navigate(['patient/tabs/home'])
      .then(() => {
        const toastObject = new Toast(this.toastController);
        toastObject.presentToast('Your settings have been saved.');
      }
    )
    }, error => {
      console.log(error);
    });
    

  }


}
