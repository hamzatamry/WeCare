import { LocationService } from './../../location.service';
import { Plugins, Capacitor } from '@capacitor/core';
import { PlaceLocation } from './../../location.model';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MapModalComponent } from './../../map-modal/map-modal.component';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  private _selectedLocationImage: string;
  private _isLoading = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  constructor(
    private modalCtrl: ModalController,
    private httpClient: HttpClient,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private locationService: LocationService
  ) { }

  get selectedLocationImage() {
    return this._selectedLocationImage;
  }

  get isLoading() {
    return this._isLoading;
  }

  ngOnInit() {}

  OnPickLocation() {
    this.actionSheetCtrl.create({
      header: 'Pick an Option',
      buttons: [
        {
          text: 'Auto Location',
          handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Locate on Map',
          handler: () => {
            this.openMap();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetElement => {
      actionSheetElement.present();
    });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showGeolocationAlert('Please pick a location using the map.');
      return;
    }
    Plugins.Geolocation.getCurrentPosition().then(geoPos => {
      this.locationService.center = {lat: geoPos.coords.latitude, lng: geoPos.coords.longitude};
      this.createMapLocation(geoPos.coords.latitude, geoPos.coords.longitude);
    }).catch(() => {
      this.showGeolocationAlert('Please make sure that the GPS service is active on your device.');
    });
  }

  private showGeolocationAlert(message: string) {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: message,
      buttons: [{
        text: 'Okay'
      }]
    }).then(alertElement => {
      alertElement.present();
    });
  }

  private openMap() {
    this.modalCtrl.create({component: MapModalComponent}).then(modalElement => {
      modalElement.onDidDismiss().then(resData => {
        if (!resData.data)
          return;
        this.createMapLocation(resData.data.lat, resData.data.lng);
      });
      modalElement.present();
    });
  }

  private createMapLocation(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null
    };
    this._isLoading = true;
    this.getAddress(lat, lng).pipe(switchMap(address => {
      pickedLocation.address = address;
      return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 16));
    })).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this._selectedLocationImage = staticMapImageUrl;
      this._isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  };

  private getAddress(lat: number, lng: number) {
    return this.httpClient.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`)
      .pipe(map(geoData => {
        if (!geoData || !geoData.results || geoData.results.length <= 0)
          return null;
        return geoData.results[0].formatted_address;
      })
    );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`;
  }
}
