import { ImagePickerService } from '../../../../../shared/pickers/image-picker/image-picker.service';
import { PlaceLocation } from 'src/app/shared/location.model';
import { LocationService } from '../../../../../shared/location.service';
import { MapModalComponent } from '../../../../../shared/map-modal/map-modal.component';
import { environment } from '../../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Countries } from '../../../../../selectionList';
import { HttpClient } from '@angular/common/http';
import { Profile } from './profil.model';
import { AuthService } from '../../../../../auth/auth.service';
import { Router } from '@angular/router';
import { Toast } from '../toast.controller'
import { ToastController, ModalController, NavController, LoadingController } from '@ionic/angular';
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

  public patient: Profile = {};

  public countries = Countries.list;

  public currentDate: string = new Date().toISOString();

  public noEditing: boolean = true;
        
  public birthdayDateForm: Date;

  public index;

  public selectedLocation: PlaceLocation = null;

  public selectedImage: Blob | File = null;

  public imageData: string;

  public age;

  public email;

  private toast;
  
  constructor(
    private requestManager: RequestManagerService,
    private authService: AuthService, private http: HttpClient, 
    private router: Router, private toastController: ToastController,
    private locationService: LocationService,
    private modalCtrl: ModalController,
    private imagePickerService: ImagePickerService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.isFetching = true;
    this.email = this.authService.email;
   
    this.requestManager.getPatientProfile()
    .subscribe(profileData => {
      console.log(profileData);
      this.patient = profileData; //sauf email
      this.locationService.center = { lat: this.patient.lat, lng: this.patient.lng };
      this.birthdayDateForm = new Date(this.patient.birthday);
      this.index = this.countries.findIndex((element) => element.name == this.patient.country);
      this.age = this.calculateAge();
      this.isFetching = false;
    } 
  ), error => {
    console.log(error);
  }};

   
  calculateAge() {
    let timeDiff = Math.abs(Date.now() - this.birthdayDateForm.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  }

  setDateAndAge() {
    this.birthdayDateForm = new Date(this.patient.birthday);
    this.age = this.calculateAge();
  }


  onSubmit() {

    console.log({id: this.authService.userId, profile: this.patient });
  
    
    if (this.selectedLocation) {
      console.log(this.selectedLocation);
      this.patient.lat = this.selectedLocation.lat;
      this.patient.lng = this.selectedLocation.lng;
      this.patient.address = this.selectedLocation.address;
      this.patient.staticMapImageUrl = this.selectedLocation.staticMapImageUrl;
    }

    this.loadingCtrl.create({
      message: 'Saving data...',
      spinner: 'circular'
    }).then(loadingElement => {
      loadingElement.present();

      if (this.selectedImage) {
        this.requestManager.saveImage(this.selectedImage, this.authService.role, this.authService.email, this.patient.firstName, this.patient.lastName).subscribe(() => {
          this.selectedImage = null;
          this.imageData = null;
          this.requestManager.setPatientProfile(this.patient).subscribe(response => {
            loadingElement.dismiss();
            console.log(response);
  
            this.navCtrl.navigateRoot("patient/tabs/home")
            .then(() => {
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
        this.requestManager.setPatientProfile(this.patient).subscribe(response => {
          loadingElement.dismiss();
          console.log(response);
  
          this.navCtrl.navigateRoot("patient/tabs/home").then(() => {
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
    })
  }

  onLocationPicked(location: PlaceLocation) {
    console.log(location);
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

