import { ImagePickerService } from './image-picker.service';
import { Platform } from '@ionic/angular';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  private _selectedImage: string;
  @Output() imagePick = new EventEmitter<string | File>();
  usePicker: boolean = false;

  constructor(private platform: Platform, private imagePickerService: ImagePickerService) { }

  get selectedImage() {
    return this._selectedImage;
  }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    try {
      if (!Capacitor.isPluginAvailable('Camera')) {
        this.filePickerRef.nativeElement.click();
        return;
      }
      Plugins.Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        // correctOrientation: true,
        allowEditing: true,
        width: 480,
        resultType: CameraResultType.DataUrl
      }).then(image => {
        this._selectedImage = image.dataUrl
        this.imagePickerService.imageData = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
        this.filePickerRef.nativeElement.value = "";
      }).catch(() => {
        if (this.usePicker)
          this.filePickerRef.nativeElement.click();
        return false;
      });
    } catch(err) {
      console.log(err);
    }
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataUrl = fileReader.result.toString();
      this._selectedImage = dataUrl;
      this.imagePickerService.imageData = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fileReader.readAsDataURL(pickedFile);
  }
}
