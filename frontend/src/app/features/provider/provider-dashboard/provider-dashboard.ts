import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTabsModule],
  templateUrl: './provider-dashboard.html',
  styleUrls: ['./provider-dashboard.scss']
})
export class ProviderDashboard implements OnInit {
  private bookingService = inject(BookingService);

  bookings: any[] = [];
  loading = true;

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
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, newStatus: string) {
    this.bookingService.updateBookingStatus(id, newStatus).subscribe({
      next: () => this.fetchBookings(),
      error: () => alert('Failed to update booking status')
    });
  }

  get pendingBookings() {
    return this.bookings.filter(b => b.booking_status === 'pending');
  }

  get activeBookings() {
    return this.bookings.filter(b => ['confirmed', 'assigned', 'in_progress'].includes(b.booking_status));
  }

  get completedBookings() {
    return this.bookings.filter(b => ['completed'].includes(b.booking_status));
  }
}
