import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController, } from '@ionic/angular';
import { Ordonnance } from '../ordonnance/ordonnance.model';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {


  public prescriptionInfo: PrescriptionInfo;
   
  constructor(private navParams : NavParams,private popoverController : PopoverController,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.prescriptionInfo = this.navParams.get('custom_id');
    
  }

  close(){
    this.popoverController.dismiss();
  }

}

interface PrescriptionInfo {
  dcIdentity: string,
  prescription: Ordonnance
}

