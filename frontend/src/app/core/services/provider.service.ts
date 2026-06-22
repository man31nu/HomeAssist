import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  getProviderProfile(): Observable<{success: boolean, data: any, message: string}> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  withdrawPayout(): Observable<{success: boolean, data: any, message: string}> {
    return this.http.post<any>(`${this.apiUrl}/withdraw`, {});
  }
}
