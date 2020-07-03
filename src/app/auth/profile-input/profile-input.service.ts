import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileInputService {

  constructor(private httpClient: HttpClient) { }

  saveProfile(email: string, role: "patient" | "doctor" | "coach", firstName: string, lastName: string, birthday: Date, sex: "m" | "f", phoneNumber: string, country: string, height: { value: number, system: string }, weight: { value: number, system: string}, illnesses: [], disabilities: [], bloodType: string, preferredNotificationTime: Date, specialty: string, details: string, location: any) {
    const requestBody = role === "patient" ? { email, role, firstName, lastName, birthday, sex, phoneNumber, country, height, weight, illnesses, disabilities, bloodType, preferredNotificationTime, details, location } : { email, role, firstName, lastName, birthday, sex, phoneNumber, country, preferredNotificationTime, specialty, details, location };
    return this.httpClient.post<{ message?: string }>(environment.apiUrl + "/user/profile", requestBody );
  }

  saveImage(profileImage: File | Blob, role: "patient" | "doctor" | "coach", email: string, firstName: string, lastName: string) {
    const postData = new FormData();
    postData.append("image", profileImage, role + " " + firstName + " " + lastName);
    postData.append('email', email);
    postData.append('role', role);
    return this.httpClient.post<{ message?: string }>(environment.apiUrl + "/user/profile-image", postData);
  }
}
