import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  goBack() {
    this.modalCtrl.dismiss();
  }

}
