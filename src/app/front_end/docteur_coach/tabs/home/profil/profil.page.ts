import { ImagePickerService } from '../../../../../shared/pickers/image-picker/image-picker.service';
import { PlaceLocation } from 'src/app/shared/location.model';
import { LocationService } from '../../../../../shared/location.service';
import { MapModalComponent } from '../../../../../shared/map-modal/map-modal.component';
import { environment } from '../../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Countries, Specialities } from '../../../../../selectionList';
import { NgForm } from '@angular/forms';
import { Profile } from './profil.model';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Toast } from '../../../../patient/tabs/home/toast.controller';
import { ToastController, ModalController, NavController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RequestManagerService } from '../request-manager.service';

function dataToBlob(data: any) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(data.split(',')[1]);

  // separate out the mime component
  var mimeString = data.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})

export class ProfilPage implements OnInit{

  public isFetching: boolean = true;

  //les données soit du docteur ou coach ca depend du champ type
  public doctor_coach: Profile = {};

  //variable qui controle l'editing
  public noEditing;
         
  //l'age du patient calculé d'apres la date de naissance
  public age;

  //la date actuelle sous forme ISO
  public currentDate: string;

  public birthdayDateForm: Date;

  //l'ensemble des pays avec leur code de tel
  public countries = Countries.list;

  //l'ensemble des specialites du docteur
  public doctorSpecialities = Specialities.doctor;
  
  //l'ensemble des specialites du coach
  public coachSpecialities = Specialities.coach;

  //l'indice de l'element contenant le nom du pays et son code ayant comme nom de pays celui choisit par le patient
  public countryIndex;

  //l'indice de la specialite du docteur ou coach
  public doctor_coachSpecialityIndex;

  public email;

  public selectedLocation: PlaceLocation = null;

  public selectedImage: Blob | File = null;

  public imageData: string;

  constructor(
    private authService: AuthService, 
    private requestManager: RequestManagerService,
    private toastController: ToastController, 
    private locationService: LocationService,
    private modalCtrl: ModalController,
    private imagePickerService: ImagePickerService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.isFetching = true;

    this.requestManager.getDoctorCoachProfile()
    .subscribe(response => {
      console.log(response);

      this.doctor_coach = response;
      this.locationService.center = { lat: this.doctor_coach.lat, lng: this.doctor_coach.lng };
      this.birthdayDateForm = new Date(this.doctor_coach.birthday);
      this.countryIndex = this.countries.findIndex((element) => element.name == this.doctor_coach.country);

      
      this.age = this.calculateAge();

      this.doctor_coachSpecialityIndex = this.doctor_coach.role == 'doctor' ?
      this.doctorSpecialities.findIndex((element) => element == this.doctor_coach.specialty)
      :this.coachSpecialities.findIndex((element) => element == this.doctor_coach.specialty)

      this.email = this.authService.email;
      this.currentDate = new Date().toISOString();
      this.noEditing = true;

      this.isFetching = false;
    });

  }

  //calcul de l'age en utilisant la date actuelle et la date de naissance
  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.birthdayDateForm.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  }

  //changer l'age en cas de changement de date de naissance
  setDateAndAge() {
    this.birthdayDateForm = new Date(this.doctor_coach.birthday);
    this.age = this.calculateAge();
  }

  async onSubmit(form: NgForm) {

    console.log({
      id: this.authService.userId, 
      profile: this.doctor_coach
    });

    if (this.selectedLocation) {
      this.doctor_coach.lat = this.selectedLocation.lat;
      this.doctor_coach.lng = this.selectedLocation.lng;
      this.doctor_coach.address = this.selectedLocation.address;
      this.doctor_coach.staticMapImageUrl = this.selectedLocation.staticMapImageUrl;
    }

    this.loadingCtrl.create({
      message: 'Saving data...',
      spinner: 'circular'
    }).then(loadingElement => {

      loadingElement.present();

      if (this.selectedImage) {
        this.requestManager.saveImage(this.selectedImage, this.authService.role, this.authService.email, this.doctor_coach.firstName, this.doctor_coach.lastName).subscribe(() => {
          this.selectedImage = null;
          this.imageData = null;
          this.requestManager.setDoctorCoachProfile(this.doctor_coach).subscribe(response => {
            loadingElement.dismiss();
            console.log(response);
  
            this.navCtrl.navigateRoot("docteur_coach/tabs/home").then(() => {
              const toastObject = new Toast(this.toastController);
              toastObject.presentToast('Your settings have been saved.');
            });
  
          }, error => {
            loadingElement.dismiss();
            console.log(error);
          });
        }, err => {
          loadingElement.dismiss();
          console.log(err);
        });
      }
  
      else {
        this.requestManager.setDoctorCoachProfile(this.doctor_coach).subscribe(response => {
          loadingElement.dismiss();
          console.log(response);
  
          this.navCtrl.navigateRoot("docteur_coach/tabs/home").then(() => {
            const toastObject = new Toast(this.toastController);
            toastObject.presentToast('Your settings have been saved.');
          });
  
        }, error => {
          loadingElement.dismiss();
          console.log(error);
        });
      }

    });
    
  }

  onShowMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.locationService.center.lat, lng: this.locationService.center.lng},
      selectable: false,
      closeButtonText: 'Close',
      title: 'Place Location'
    }}).then(modalElement => {
      modalElement.present();
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.selectedLocation = location;
  }

  onImagePicked(imageData: string | File) {
    let imageFile: any;
    if (typeof imageData === 'string') {
      try {
        imageFile = dataToBlob(imageData);
      }
      catch (error) {
        console.log(error);
        return;
      }
    }
    else {
      imageFile = imageData;
    }
    this.selectedImage = imageFile;
    this.imageData = this.imagePickerService.imageData;
  }

}

