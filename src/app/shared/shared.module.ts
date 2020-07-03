import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
    imports: [CommonModule, IonicModule],
    exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {}