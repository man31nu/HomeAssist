import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  getBookings(): Observable<{success: boolean, data: Booking[], message: string}> {
    return this.http.get<any>(this.apiUrl);
  }

  createBooking(bookingData: any): Observable<{success: boolean, data: Booking, message: string}> {
    return this.http.post<any>(this.apiUrl, bookingData);
  }

  updateBookingStatus(id: number, status: string): Observable<{success: boolean, data: Booking, message: string}> {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }
}
