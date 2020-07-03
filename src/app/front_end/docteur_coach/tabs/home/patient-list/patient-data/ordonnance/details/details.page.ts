import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  // objet passé par la page d'ordonnace
  public prescriptionInfo : Prescription;


  constructor(private navParams : NavParams,private popoverController : PopoverController) { }

  ngOnInit() {
    this.prescriptionInfo = this.navParams.get('custom_id');
  }

  close(){
    this.popoverController.dismiss();
  }

  duplicate(){
    this.popoverController.dismiss(this.prescriptionInfo.index);
  }

}

interface Prescription {
  prescription:{
    consultationDate: Date,
    situation: string,
    medication: string [],
    details: string,
  },
  patientName: string,
  index: number
}