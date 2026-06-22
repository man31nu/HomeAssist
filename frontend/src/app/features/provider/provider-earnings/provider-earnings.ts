import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { ProviderService } from '../../../core/services/provider.service';

@Component({
  selector: 'app-provider-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-earnings.html',
  styleUrls: ['./provider-earnings.scss']
})
export class ProviderEarnings implements OnInit {
  private bookingService = inject(BookingService);
  private providerService = inject(ProviderService);

  completedBookings: any[] = [];
  totalEarnings = 0;
  availablePayout = 0;
  loading = true;

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    
    // Fetch bookings for history
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        this.completedBookings = res.data.filter((b: any) => b.booking_status === 'completed');
        this.totalEarnings = this.completedBookings.reduce((sum, job) => sum + Number(job.total_amount), 0);
      },
      error: () => console.error('Failed to load bookings')
    });

    // Fetch real payout balance from Provider profile
    this.providerService.getProviderProfile().subscribe({
      next: (res) => {
        this.availablePayout = Number(res.data.wallet_balance || 0);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  requestPayout() {
    this.providerService.withdrawPayout().subscribe({
      next: (res) => {
        alert(res.message);
        this.availablePayout = 0;
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to withdraw payout');
      }
    });
  }
}
