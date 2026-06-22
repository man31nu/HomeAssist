import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models';
import { PaymentService } from '../../../core/services/payment.service';
import { environment } from '../../../../environments/environment';

declare var Razorpay: any;
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.scss']
})
export class CustomerDashboard implements OnInit {
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  public authService = inject(AuthService);

  bookings: any[] = []; // using any since backend maps to snake_case right now
  loading = true;
  error = '';

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings() {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        this.bookings = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.updateBookingStatus(id, 'cancelled').subscribe({
        next: (res) => {
          this.fetchBookings(); // Refresh list
        },
        error: (err) => {
          alert('Failed to cancel booking.');
        }
      });
    }
  }

  get activeBookings() {
    return this.bookings.filter(b => ['pending', 'confirmed', 'assigned', 'in_progress'].includes(b.booking_status));
  }

  payBooking(booking: any) {
    this.paymentService.createRazorpayOrder(booking.id).subscribe({
      next: (res) => {
        if (!res.success) {
          alert('Failed to create order');
          return;
        }

        const options = {
          key: res.data.key_id || environment.razorpayKeyId,
          amount: res.data.amount,
          currency: res.data.currency,
          name: 'HomeAssist',
          description: `Payment for Booking #${booking.booking_number}`,
          order_id: res.data.order_id,
          handler: (response: any) => {
            this.verifyPayment(response, booking.id);
          },
          prefill: {
            name: this.authService.currentUserValue?.name || '',
            email: this.authService.currentUserValue?.email || '',
          },
          theme: {
            color: '#3f51b5'
          }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            alert('Payment failed: ' + response.error.description);
        });
        rzp.open();
      },
      error: (err) => {
        alert('Error creating payment order');
      }
    });
  }

  verifyPayment(response: any, bookingId: number) {
    this.paymentService.verifyRazorpayPayment({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      booking_id: bookingId
    }).subscribe({
      next: (res) => {
        alert('Payment successful!');
        this.fetchBookings();
      },
      error: (err) => {
        alert('Payment verification failed');
      }
    });
  }


  get pastBookings() {
    return this.bookings.filter(b => ['completed', 'cancelled'].includes(b.booking_status));
  }
}
