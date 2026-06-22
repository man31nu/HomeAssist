import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  searchQuery = '';

  services = [
    {
      icon: '🧹',
      name: 'CLEANING',
      desc: 'Full home deep cleaning, bathroom, kitchen.',
      price: 599,
      category: 'Cleaning'
    },
    {
      icon: '🔧',
      name: 'PLUMBING',
      desc: 'Expert plumbing repairs and installations.',
      price: 149,
      category: 'Plumber'
    },
    {
      icon: '❄️',
      name: 'AC REPAIR',
      desc: 'AC servicing, repair and gas refill.',
      price: 499,
      category: 'AC Repair'
    },
    {
      icon: '💅',
      name: 'SALON FOR WOMEN',
      desc: 'Beauty, grooming and relaxing massages.',
      price: 699,
      category: 'Salon for Women'
    }
  ];

  stats = [
    { icon: '🏠', value: '10,000+', label: 'Happy Clients' },
    { icon: '👷', value: '500+',    label: 'Expert Pros'   },
    { icon: '⭐', value: '4.9★',   label: 'Average Rating' },
    { icon: '🕐', value: '24/7',    label: 'Support'        }
  ];

  private router = inject(Router);
  public authService = inject(AuthService);

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/services'], { queryParams: { q: this.searchQuery } });
    } else {
      this.router.navigate(['/services']);
    }
  }

  bookService(category: string) {
    this.router.navigate(['/services'], { queryParams: { category } });
  }

  onCtaClick() {
    const user = this.authService.currentUserValue;
    if (user) {
      const role = (user.role || '').toLowerCase();
      if (role === 'provider') {
        this.router.navigate(['/provider']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/customer']);
      }
    } else {
      this.router.navigate(['/register']);
    }
  }
}
