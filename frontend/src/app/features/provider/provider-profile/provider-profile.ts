import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provider-profile.html',
  styleUrls: ['./provider-profile.scss']
})
export class ProviderProfile implements OnInit {
  currentUser: any = null;
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  saving = false;
  saveSuccess = false;

  getInitials(): string {
    if (!this.currentUser?.name) return 'P';
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  saveChanges() {
    this.saving = true;
    this.saveSuccess = false;
    this.cdr.detectChanges();

    // Simulate API call to save profile
    setTimeout(() => {
      this.saving = false;
      this.saveSuccess = true;
      this.cdr.detectChanges();
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        this.saveSuccess = false;
        this.cdr.detectChanges();
      }, 3000);
    }, 1200);
  }
}
