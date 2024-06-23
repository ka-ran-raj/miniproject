// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/signup`, userData);
  }

  loginAdmin(credentials: { phoneNumber: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
  }

  saveProfileDetails(profileDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tickets`, profileDetails);
  }
  getTicketsByPhoneNumber(phoneNumber: string): Observable<any> {
    const params = new HttpParams().set('phoneNumber', phoneNumber);
    return this.http.get('http://localhost:3000/api/tickets', { params });
  }
}
