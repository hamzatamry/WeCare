import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.page.html',
  styleUrls: ['./patient-data.page.scss'],
})
export class PatientDataPage implements OnInit {

  public fullName;
  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(element => {
      this.fullName = element['patientLastName'] + '_' + element['patientFirstName'];

    })

    
    
  }

}
