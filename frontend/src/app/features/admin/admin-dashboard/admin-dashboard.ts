import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DashboardStats, User, Provider, SupportTicket, Service, Booking } from '../../../core/models';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  stats: DashboardStats | null = null;
  users: User[] = [];
  providers: Provider[] = [];
  tickets: SupportTicket[] = [];
  services: Service[] = [];
  bookings: Booking[] = [];
  
  loading = true;
  error = '';
  activeTab = 'overview';

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      if (url.length > 0) {
        this.activeTab = url[0].path;
      } else {
        this.activeTab = 'overview';
      }
    });
    this.fetchAllData();
  }

  fetchAllData() {
    this.loading = true;
    this.error = '';

    forkJoin({
      stats: this.http.get<{success: boolean, data: DashboardStats}>(`${environment.apiUrl}/admin/stats`),
      users: this.http.get<{success: boolean, data: User[]}>(`${environment.apiUrl}/admin/users`),
      providers: this.http.get<{success: boolean, data: Provider[]}>(`${environment.apiUrl}/providers`),
      tickets: this.http.get<{success: boolean, data: SupportTicket[]}>(`${environment.apiUrl}/support-tickets`),
      services: this.http.get<{success: boolean, data: Service[]}>(`${environment.apiUrl}/services`),
      bookings: this.http.get<{success: boolean, data: Booking[]}>(`${environment.apiUrl}/bookings`)
    }).subscribe({
      next: (res) => {
        this.stats = res.stats?.data || null;
        this.users = (res.users?.data || []).map((u: any) => ({
          ...u,
          role: u.role || (u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'Customer' : u.role_id === 3 ? 'Provider' : 'Unknown')
        }));
        this.providers = res.providers?.data || [];
        this.tickets = res.tickets?.data || [];
        this.services = res.services?.data || [];
        this.bookings = res.bookings?.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching admin data:', err);
        this.error = 'Failed to load dashboard data. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approveProvider(providerId: number) {
    if (!confirm('Are you sure you want to approve this provider?')) return;
    
    this.http.put<{success: boolean, data: Provider}>(`${environment.apiUrl}/providers/${providerId}/approve`, {})
      .subscribe({
        next: (res) => {
          // Update local state
          const index = this.providers.findIndex(p => p.id === providerId);
          if (index !== -1) {
            this.providers[index].isVerified = true;
            // The backend returns the updated object. Sometimes we map snake_case to camelCase.
            // Adjust according to backend response.
            this.providers[index] = { ...this.providers[index], ...res.data };
          }
          alert('Provider approved successfully!');
        },
        error: (err) => {
          console.error('Error approving provider:', err);
          alert('Failed to approve provider.');
        }
      });
  }

  updateTicketStatus(ticketId: number, newStatus: string) {
    this.http.put<{success: boolean, data: SupportTicket}>(`${environment.apiUrl}/support-tickets/${ticketId}/status`, { status: newStatus })
      .subscribe({
        next: (res) => {
          // Update local state
          const index = this.tickets.findIndex(t => t.id === ticketId);
          if (index !== -1) {
            this.tickets[index].status = newStatus as any;
          }
          // Optional toast
        },
        error: (err) => {
          console.error('Error updating ticket status:', err);
          alert('Failed to update ticket status.');
          // Re-fetch to reset the select dropdown if it failed
          this.fetchAllData();
        }
      });
  }

  updateProviderCategory(providerId: number, newCategory: string) {
    this.http.post<{success: boolean, data: Provider}>(`${environment.apiUrl}/admin/provider/${providerId}/category`, { category: newCategory })
      .subscribe({
        next: (res) => {
          const index = this.providers.findIndex(p => p.id === providerId);
          if (index !== -1) {
            this.providers[index].service_category = newCategory;
          }
          alert('Provider category updated successfully!');
        },
        error: (err) => {
          console.error('Error updating provider category:', err);
          alert('Failed to update provider category.');
          this.fetchAllData();
        }
      });
  }

  getPendingProviders() {
    // Check 'verification_status' or 'isVerified' depending on backend payload mapping
    return this.providers.filter((p: any) => p.verification_status === 'pending' || p.isVerified === false);
  }
}
