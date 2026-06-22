import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  
  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats() {
    this.http.get<{success: boolean, data: DashboardStats, message: string}>(`${environment.apiUrl}/admin/stats`)
      .subscribe({
        next: (response) => {
          this.stats = response.data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load dashboard statistics.';
          this.loading = false;
          console.error(err);
        }
      });
  }
}
