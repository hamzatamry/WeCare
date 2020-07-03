import { environment } from './../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResetPassService {

  constructor(private httpClient: HttpClient) { }

  sendPassword(email: string, role: "patient" | "doctor" | "coach", password: string, code: string) {
    return this.httpClient.post<{ message?: string }>(environment.apiUrl + '/user/passwordReset', { email, role, password, code });
  }
}
