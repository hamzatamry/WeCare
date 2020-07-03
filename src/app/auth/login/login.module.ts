import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage, VerifyEmailComponent],
  entryComponents: [VerifyEmailComponent]
})
export class LoginPageModule {}
