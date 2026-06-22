import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-provider-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-earnings.html',
  styleUrls: ['./provider-earnings.scss']
})
export class ProviderEarnings implements OnInit {
  private bookingService = inject(BookingService);

  completedBookings: any[] = [];
  totalEarnings = 0;
  availablePayout = 0;
  loading = true;

  ngOnInit(): void {
    this.bookingService.getBookings().subscribe({
      next: (res) => {
        // Filter only completed jobs
        this.completedBookings = res.data.filter((b: any) => b.booking_status === 'completed');
        
        // Calculate earnings
        this.totalEarnings = this.completedBookings.reduce((sum, job) => sum + Number(job.total_amount), 0);
        this.availablePayout = this.totalEarnings; // Assuming they haven't withdrawn yet for MVP
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  requestPayout() {
    alert(`Success! ₹${this.availablePayout} has been transferred to your registered bank account.`);
    this.availablePayout = 0; // Mock payout logic
  }
}
