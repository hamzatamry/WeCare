import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage, VerifyEmailComponent],
  entryComponents: [VerifyEmailComponent]
})
export class AuthPageModule {}
