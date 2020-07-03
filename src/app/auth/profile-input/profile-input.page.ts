import { ImagePickerService } from './../../shared/pickers/image-picker/image-picker.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { ProfileInputService } from './profile-input.service';
import { AuthService } from './../auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlaceLocation } from 'src/app/shared/location.model';
import { Plugins } from '@capacitor/core';
import { Countries, Diseases, Handicaps, Specialities } from './../../selectionList';

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
  selector: 'app-profile-input',
  templateUrl: './profile-input.page.html',
  styleUrls: ['./profile-input.page.scss'],
})
export class ProfileInputPage implements OnInit {
  @ViewChild("slides") slides: any;
  currentHeight: number;
  currentWeight: number;
  private _role: "patient" | "doctor" | "coach";
  slideOpts: any;
  countryCodes: any;
  illnessList: any;
  disabilityList: any;
  specialtyList: any;
  doctorSpecialtyList: any;
  coachSpecialtyList: any;
  bloodTypeList: any
  private _selectedLocation: any;
  private _selectedImage: File | Blob;
  toast: any;
  public imageData: string;

  constructor(
    private authService: AuthService,
    private profileInputService: ProfileInputService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private imagePickerService: ImagePickerService
  ) { }

  get role() {
    return this._role;
  }

  get selectedLocation() {
    return this._selectedLocation;
  }

  get selectedImage() {
    return this._selectedImage;
  }

  ngOnInit() {
    const roleCopy = {...{role: this.authService.role}};
    this._role = roleCopy.role;
    this.bloodTypeList = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-"
    ];
    this.illnessList = Diseases.list;
    this.illnessList.push("Other");
    this.disabilityList = Handicaps.list;
    this.disabilityList.push("Other");
    this.specialtyList = this.role === "doctor" ? Specialities.doctor : Specialities.coach;
    this.specialtyList.push("Other");
    this.countryCodes = Countries.list;
    this.slideOpts = {
      slidesPerView: 1,
      coverflowEffect: {
        rotate: 50,
        stretch: 10,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
      on: {
        beforeInit() {
          const swiper = this;
    
          swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
          swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    
          swiper.params.watchSlidesProgress = true;
          swiper.originalParams.watchSlidesProgress = true;
        },
        setTranslate() {
          const swiper = this;
          const {
            width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
          } = swiper;
          const params = swiper.params.coverflowEffect;
          const isHorizontal = swiper.isHorizontal();
          const transform$$1 = swiper.translate;
          const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
          const rotate = isHorizontal ? params.rotate : -params.rotate;
          const translate = params.depth;
          // Each slide offset from center
          for (let i = 0, length = slides.length; i < length; i += 1) {
            const $slideEl = slides.eq(i);
            const slideSize = slidesSizesGrid[i];
            const slideOffset = $slideEl[0].swiperSlideOffset;
            const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;
    
            let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
            let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
            // var rotateZ = 0
            let translateZ = -translate * Math.abs(offsetMultiplier);
    
            let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
            let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;
    
             // Fix for ultra small values
            if (Math.abs(translateX) < 0.001) translateX = 0;
            if (Math.abs(translateY) < 0.001) translateY = 0;
            if (Math.abs(translateZ) < 0.001) translateZ = 0;
            if (Math.abs(rotateY) < 0.001) rotateY = 0;
            if (Math.abs(rotateX) < 0.001) rotateX = 0;
    
            const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
            $slideEl.transform(slideTransform);
            $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
            if (params.slideShadows) {
              // Set shadows
              let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
              let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
              if ($shadowBeforeEl.length === 0) {
                $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
                $slideEl.append($shadowBeforeEl);
              }
              if ($shadowAfterEl.length === 0) {
                $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
                $slideEl.append($shadowAfterEl);
              }
              if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
              if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
            }
          }
    
           // Set correct perspective for IE10
          if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
            const ws = $wrapperEl[0].style;
            ws.perspectiveOrigin = `${center}px 50%`;
          }
        },
        setTransition(duration: any) {
          const swiper = this;
          swiper.slides
            .transition(duration)
            .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
            .transition(duration);
        }
      }
    }
  }

  onQuit() {
    this.authService.logout();
    this.navCtrl.navigateRoot("/login");
  }

  onNext() {
    this.slides.slideNext(500);
  }

  onPrevious() {
    this.slides.slidePrev(500);
  }

  onHeightSystemChange(system: string) {
    if (this.currentHeight > 0) {
      if (system === "meters") {
        const height = (this.currentHeight * 0.3048).toFixed(2);
        this.currentHeight = +height;
      }
      else if (system === "feet") {
        const height = (this.currentHeight / 0.3048).toFixed(2);
        this.currentHeight = +height;
      }
    }
  }

  onWeightSystemChange(system: string) {
    if (this.currentWeight > 0) {
      if (system === "kgs") {
        const weight = (this.currentWeight / 2.205).toFixed(2);
        this.currentWeight = +weight;
      }
      else if (system === "pounds") {
        const weight = (this.currentWeight * 2.205).toFixed(2);
        this.currentWeight = +weight;
      }
    }
  }

  onLocationPicked(location: PlaceLocation) {
    this._selectedLocation = location;
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
    this._selectedImage = imageFile;
    this.imageData = this.imagePickerService.imageData;
  }

  onFormSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const firstName = form.value.firstName.trim();
    const lastName = form.value.lastName.trim();
    const birthday = form.value.birthday.substring(0, 10);
    const sex = form.value.sex;
    const countryCode = form.value.code.split(" ");
    const phoneNumber = form.value.phoneNumber;
    const country = countryCode[1];
    let value = form.value.height ? form.value.height.toFixed(2) : null;
    const height = {
      value: +value,
      system: form.value.inHeight ? form.value.inHeight : null
    };
    value = form.value.weight ? form.value.weight.toFixed(2) : null;
    const weight = {
      value: +value,
      system: form.value.inWeight ? form.value.inWeight: null
    };
    const illnesses = form.value.illnesses;
    const disabilities = form.value.disabilities;
    const bloodType = form.value.bloodType;
    const preferredNotificationTime = form.value.notificationTime; 
    const specialty = form.value.specialty;
    const details = form.value.details.trim();
    const profileImage = this.selectedImage;
    const location = this.selectedLocation;
    this.loadingCtrl.create({
      message: "Saving data...",
      spinner: "circular"
    }).then(loadingElement => {
      loadingElement.present();
      const path = this.role === "patient" ? 'patient' : 'docteur_coach';
      this.profileInputService.saveProfile(this.authService.email, this.role, firstName, lastName, birthday, sex, phoneNumber, country, height, weight, illnesses, disabilities, bloodType, preferredNotificationTime, specialty, details, location).subscribe(() => {
        Plugins.Storage.get({ key: 'authData' }).then(storedData => {
          const parsedData = JSON.parse(storedData.value) as {
            userId: string,
            token: string,
            role: 'patient' | 'doctor' | 'coach',
            set: boolean
            expirationDate: string
          };
          const data = JSON.stringify({
            userId: this.authService.userId,
            email: this.authService.email,
            token: parsedData.token,
            role: this.role,
            set: true,
            expirationDate: parsedData.expirationDate
          });
          Plugins.Storage.set({ key: 'authData', value: data });
          if (profileImage) {
            this.profileInputService.saveImage(profileImage, this.role, this.authService.email, firstName, lastName).subscribe(() => {
              this.navCtrl.navigateRoot(`${path}/tabs/home`);
              loadingElement.dismiss();
            }, err => {
              this.navCtrl.navigateRoot(`${path}/tabs/home`).then(async () => {
                loadingElement.dismiss();
                if (this.toast) {
                  this.toast.dismiss();
                }
                this.toast = await this.toastCtrl.create({
                  message: err.error.message,
                  duration: 4000,
                  position: "bottom"
                });
                if (this.toast) {
                  this.toast.present();
                }
              });
            })
          }
          else {
            this.navCtrl.navigateRoot(`${path}/tabs/home`);
            loadingElement.dismiss();
          }
        });
      }, async err => {
        loadingElement.dismiss();
        if (this.toast) {
          this.toast.dismiss();
        }
        this.toast = await this.toastCtrl.create({
          message: err.error.message,
          duration: 4000,
          position: "bottom"
        });
        if (this.toast) {
          this.toast.present();
        }
      });
    });
  }
}
