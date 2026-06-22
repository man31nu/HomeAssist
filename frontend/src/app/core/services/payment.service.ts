import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  createRazorpayOrder(bookingId: number): Observable<{success: boolean, data: {order_id: string, amount: number, currency: string, key_id?: string}, message: string}> {
    return this.http.post<any>(`${this.apiUrl}/create-order`, { booking_id: bookingId });
  }

  verifyRazorpayPayment(verificationData: {razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string, booking_id: number}): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify`, verificationData);
  }
}
