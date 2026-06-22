import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ServiceService } from '../../../core/services/service.service';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Service } from '../../../core/models';
import { environment } from '../../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './service-details.html',
  styleUrls: ['./service-details.scss']
})
export class ServiceDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private serviceService = inject(ServiceService);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  public authService = inject(AuthService);

  service: Service | null = null;
  loading = true;
  bookingLoading = false;
  error = '';
  bookingSuccess = false;

  bookingForm: FormGroup;

  constructor() {
    this.bookingForm = this.fb.group({
      scheduledDate: ['', Validators.required],
      address: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    console.log('ngOnInit param id:', paramId);
    const id = Number(paramId);
    console.log('Parsed id:', id);
    if (!isNaN(id) && id > 0) {
      console.log('Calling getServiceById');
      this.serviceService.getServiceById(id).subscribe({
        next: (res) => {
          try {
            console.log('Service response:', res);
            if (!res || !res.data) {
              throw new Error('Invalid response data');
            }
            const s = res.data as any; // Cast to any to access backend snake_case properties
            this.service = {
              id: s.id,
              name: s.title ?? '',
              description: s.description ?? '',
              category: s.ServiceCategory?.name ?? 'Other',
              basePrice: s.base_price ?? 0,
              iconUrl: s.ServiceCategory?.image_url ?? null
            };
            this.loading = false;

            // Pre-fill address if logged in
            const user = this.authService.currentUserValue;
            if (user && user.address) {
              this.bookingForm.patchValue({ address: user.address });
            }
          } catch (e: any) {
            console.error('Error parsing service data:', e);
            this.error = 'Error loading service details.';
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Service API Error:', err);
          this.error = err?.error?.message || 'Service not found or failed to load.';
          this.loading = false;
        }
      });
    } else {
      console.log('Invalid ID encountered!');
      this.error = 'Invalid Service ID.';
      this.loading = false;
    }
  }

  onSubmitBooking() {
    if (!this.authService.currentUserValue) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    if (!this.service) return;

    this.error = ''; // Clear any previous error
    this.initiateRazorpayPayment();
  }

  private initiateRazorpayPayment() {
    this.bookingLoading = true;

    // 1. Create the pending booking first
    const formVals = this.bookingForm.value;
    const bookingData = {
      service_id: this.service!.id,
      scheduled_date: formVals.scheduledDate,
      notes: formVals.notes
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (bookingRes) => {
        const bookingId = bookingRes.data.id as number;

        // 2. Request Razorpay Order ID from Backend
        this.paymentService.createRazorpayOrder(bookingId).subscribe({
          next: (orderRes) => {
            const { order_id, amount, currency, key_id } = orderRes.data;

            // 3. Open Razorpay Checkout Modal
            const options = {
              key: key_id || environment.razorpayKeyId,
              amount: amount,
              currency: currency,
              name: 'HomeAssist',
              description: `Payment for ${this.service?.name}`,
              image: 'https://cdn-icons-png.flaticon.com/512/2932/2932594.png', // HomeAssist logo placeholder
              order_id: order_id,
              handler: (response: any) => {
                this.verifyPayment(response, bookingId);
              },
              prefill: {
                name: this.authService.currentUserValue?.name || '',
                email: this.authService.currentUserValue?.email || '',
              },
              theme: {
                color: '#2e7d32' // HomeAssist brand green
              },
              modal: {
                ondismiss: () => {
                  this.bookingLoading = false;
                }
              }
            };

            // Defensive check for completely blocked scripts
            if (typeof Razorpay === 'undefined') {
              this.error = 'Payment Gateway failed to load. Please disable your AdBlocker or Brave Shields and refresh the page.';
              this.bookingLoading = false;
              return;
            }

            try {
              const rzp = new Razorpay(options);
              rzp.on('payment.failed', (response: any) => {
                this.error = 'Payment Failed! ' + response.error.description;
                this.bookingLoading = false;
              });

              rzp.open();

              // Fallback for Brave Shields fake object interception
              setTimeout(() => {
                const isRzpInDOM = document.querySelector('.razorpay-container');
                if (!isRzpInDOM) {
                  this.error = 'Your browser (Brave Shields / Adblocker) is silently blocking the payment popup! Please turn off Shields/Adblocker for localhost.';
                  this.bookingLoading = false;
                }
              }, 2500);

            } catch (e) {
              this.error = 'An error occurred while opening the payment gateway.';
              this.bookingLoading = false;
            }
          },
          error: (err) => {
            this.error = 'Failed to initialize payment gateway. ' + (err.error?.message || '');
            this.bookingLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create booking.';
        this.bookingLoading = false;
      }
    });
  }

  private verifyPayment(response: any, bookingId: number) {
    const verificationData = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      booking_id: bookingId
    };

    this.paymentService.verifyRazorpayPayment(verificationData).subscribe({
      next: (res) => {
        this.bookingSuccess = true;
        this.bookingLoading = false;

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/customer']);
        }, 2000);
      },
      error: (err) => {
        alert('Payment verification failed. Please contact support.');
        this.bookingLoading = false;
      }
    });
  }
}
