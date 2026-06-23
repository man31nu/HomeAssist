import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../core/services/service.service';
import { Service } from '../../../core/models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './services-list.html',
  styleUrls: ['./services-list.scss']
})
export class ServicesList implements OnInit {
  private serviceService = inject(ServiceService);
  private route = inject(ActivatedRoute);

  services: Service[] = [];
  filteredServices: Service[] = [];
  loading = true;
  error = '';
  searchQuery = '';
  activeCategory = 'All';

  categories = ['All', 'Cleaning', 'Plumber', 'AC Repair', 'Electrician', 'Carpenter', 'Salon for Women'];

  categoryIcons: Record<string, string> = {
    'Cleaning': '🧹',
    'Plumber': '🔧',
    'AC Repair': '❄️',
    'Electrician': '⚡',
    'Carpenter': '🪚',
    'Salon for Women': '💅'
  };

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const cat = params['category'];
      if (cat) {
        this.activeCategory = cat;
      } else {
        this.activeCategory = 'All';
      }

      const q = params['q'];
      if (q) {
        this.searchQuery = q;
      } else {
        this.searchQuery = '';
      }

      if (this.services.length > 0) {
        this.applyFilter();
        this.cdr.detectChanges();
      }
    });

    this.serviceService.getServices().subscribe({
      next: (res) => {
        // Map backend snake_case to frontend model
        this.services = res.data.map((s: any) => ({
          id: s.id,
          name: s.title,
          description: s.description,
          category: s.ServiceCategory ? s.ServiceCategory.name : 'Other',
          basePrice: s.base_price,
          iconUrl: s.ServiceCategory ? s.ServiceCategory.image_url : null
        }));
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load services. Please ensure the backend is running.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterBy(category: string) {
    this.activeCategory = category;
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.services];
    if (this.activeCategory !== 'All') {
      result = result.filter(s => s.category === this.activeCategory);
    }
    if (this.searchQuery) {
      result = result.filter(s => {
        const serviceName = s.name || (s as any).title || '';
        return serviceName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
               (s.description || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
    this.filteredServices = result;
  }

  getIcon(category: string | undefined): string {
    if (!category) return '🛠️';
    return this.categoryIcons[category] || '🏠';
  }
}
