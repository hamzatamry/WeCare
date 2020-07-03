import { Injectable } from '@angular/core';
import { Profile } from './profil/profil.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Physic } from './physic/physic.model';
import { SampleSensorSent } from './simulation.service';
import { map } from 'rxjs/operators';
import { Ordonnance } from './docteur-coach-list/ordonnance/ordonnance.model';

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getPatientProfile() {

    return this.http.get<Profile>(environment.apiUrl + `/patient/profile/${this.authService.userId}`,
    { responseType: 'json' });

  }

  setPatientProfile(patient: Profile) {

    return this.http.post(environment.apiUrl + "/patient/profile", 
    { id: this.authService.userId, profile: patient } );

  }

  getPatientPhysMedData() {

    return this.http.get<Physic>(
      environment.apiUrl + `/patient/otherData/${this.authService.userId}`,{ 
        responseType: 'json' 
      }
    );
  }

  setPatientPhysMedData(dataSanitaire: Physic) {

    return this.http.post(
      environment.apiUrl + '/patient/otherData', { 
        id: this.authService.userId, 
        data: dataSanitaire
      } 
    );

  }

  getPatientSensorData() {
    return this.http.get(
      environment.apiUrl + `/patient/sensorData/${this.authService.userId}`
    );
  }

  setPatientSensorData(sampleSensorSent: SampleSensorSent, sampleState: boolean) {

    return this.http.post<{ waitTime?: number }>(environment.apiUrl + "/patient/sample", {
      id: this.authService.userId,
      sensorData: sampleSensorSent,
      normal: sampleState
    });

  }

  getDoctorCoachList() {

    return this.http.get(
      environment.apiUrl + `/patient/dcList/${this.authService.userId}`, { 
        responseType: 'json'
       })
    .pipe(map(responseData => {
      console.log(responseData)
 
 
        return responseData['dcList'];
    }));

  }

  addPatientRequest(requestToDoctorCoach) {

    return this.http.post(
      environment.apiUrl + '/patient/patientRequest', {
        id: this.authService.userId,
        dc: requestToDoctorCoach
      }
    );
    
  }

  deleteDoctorsCoaches(idPatientListChecked: string[]) {

    return this.http.post(
      environment.apiUrl + `/${this.authService.role}/dcDelete`, {
        id: this.authService.userId,
        dcIdList: idPatientListChecked
    });
  }

  getPrescriptionList(otherId: string) {

    return this.http.get<Ordonnance[]>(environment.apiUrl + `/patient/prescription/${this.authService.userId}/${otherId}`)
          .pipe(map(response => {
            return response['prescriptionList'];
          }));
  }

  saveImage(profileImage: File | Blob, role: "patient" | "doctor" | "coach", email: string, firstName: string, lastName: string) {
    const postData = new FormData();
    postData.append("image", profileImage, role + " " + firstName + " " + lastName);
    postData.append('email', email);
    postData.append('role', role);
    return this.http.post<{ message?: string }>(environment.apiUrl + "/user/profile-image", postData);
  }

}
