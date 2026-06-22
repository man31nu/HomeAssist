import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Service } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) { }

  getServices(): Observable<{ success: boolean, data: Service[], message: string }> {
    return this.http.get<any>(this.apiUrl);
  }

  getServiceById(id: number): Observable<{ success: boolean, data: Service, message: string }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
