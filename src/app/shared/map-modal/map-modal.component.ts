import { LocationService } from './../location.service';
import { Coordinates } from './../location.model';
import { environment } from './../../../environments/environment';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center: Coordinates = {lat: 0, lng: 0};
  @Input() selectable: boolean = true;
  @Input() closeButtonText: string = 'Cancel';
  @Input() title: string = 'Pick Location';
  private clickListener: any;
  private googleMaps: any;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2, 
    private locationService: LocationService
  ) { }

  ngOnInit() {
    if (this.locationService.center) {
      this.center = this.locationService.center;
    }
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapElement = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapElement, {
        center: this.center,
        zoom: this.locationService.center ? 16 : 4
      });
      googleMaps.event.addListenerOnce(map, 'idle', () => {
        this.renderer.addClass(mapElement, 'visible');
      });
      if (this.selectable)
      {
        this.clickListener = map.addListener('click', event => {
          const selectedCords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          this.locationService.center = selectedCords;
          this.modalCtrl.dismiss(selectedCords);
        });
      }
      else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: 'Picked Location'
        });
        marker.setMap(map);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  OnCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps)
      return Promise.resolve(googleModule.maps);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps)
          resolve(loadedGoogleModule.maps);
        else
          reject('Google maps SDK not available.');
      };
    });
  }
}
