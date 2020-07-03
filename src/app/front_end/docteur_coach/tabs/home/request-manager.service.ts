import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Profile } from './profil/profil.model';
import { environment } from 'src/environments/environment';
import { Patient } from './patient-list/patient.model';
import { map } from 'rxjs/operators';
import { Physic } from './patient-list/patient-data/physic/physic.model';
import { Prescription } from './patient-list/patient-data/ordonnance/ordonnance.page';

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getDoctorCoachProfile() {
    return this.http.get<Profile>(environment.apiUrl + `/${this.authService.role}/profile/${this.authService.userId}`);
  }

  setDoctorCoachProfile(doctor_coach: Profile) {
    return this.http.post(environment.apiUrl + `/${this.authService.role}/profile`, 
    { id: this.authService.userId, profile: doctor_coach })
  }

  getPatientList() {
    return this.http.get<Patient[]>(environment.apiUrl + `/${this.authService.role}/patientList/${this.authService.userId}`)
    .pipe(map(response => {
      console.log(response);
      return response['patientList'];
    }))
  }

  acceptPatientRequest(patientList: Patient[], patientIndex: number) {

    return this.http.post(environment.apiUrl + `/${this.authService.role}/acceptPatientRequest`, 
    { patientId: patientList[patientIndex].patient._id, id: this.authService.userId });

  }

  rejectPatientRequest(patientList: Patient[], patientIndex: number) {

    return this.http.post(
      environment.apiUrl + `/${this.authService.role}/deletePatient`, {
        id: this.authService.userId,
        patientIdList: [patientList[patientIndex].patient._id]
    }
    )
  }

  getPatientSensorData(otherId: string) {

    return this.http.get(
      environment.apiUrl + `/${this.authService.role}/patientData/sensorData/${this.authService.userId}/${otherId}`
    );
  }

  getPatientPhysMedData(otherId: string) {

    return this.http.get<Physic>(
      environment.apiUrl + `/${this.authService.role}/patientData/otherData/${this.authService.userId}/${otherId}`,{ 
        responseType: 'json' 
      }
    )
  }

  getDoctorPrescriptionList(otherId: string) {

    return this.http.get(
      environment.apiUrl + `/${this.authService.role}/prescription/${this.authService.userId}/${otherId}`
    )
    .pipe(
      map((result) => {
        console.log(result);
        return result["prescriptionList"];
      })
    )
  } 

  addPrescription(newPrescription: Prescription) {
    return this.http.post(
      environment.apiUrl + `/${this.authService.role}/prescription`,
      {
        id: this.authService.userId,
        otherId: this.authService.otherId,
        prescription: newPrescription
      }
    )
  }

  saveImage(profileImage: File | Blob, role: "patient" | "doctor" | "coach", email: string, firstName: string, lastName: string) {
    const postData = new FormData();
    postData.append("image", profileImage, role + " " + firstName + " " + lastName);
    postData.append('email', email);
    postData.append('role', role);
    return this.http.post<{ message?: string }>(environment.apiUrl + "/user/profile-image", postData);
  }

}
