import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  totalPrice: number = 0;
  paymentRequest!: google.payments.api.PaymentDataRequest;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      gatepassType: ['', Validators.required],
      numberOfAdults: [0, Validators.required],
      numberOfChildren: [0, Validators.required]
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });

    this.paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'VISA', 'MASTERCARD']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId'
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant'
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '0.00', // This will be updated dynamically
        currencyCode: 'USD',
        countryCode: 'US'
      }
    };
  }

  ngOnInit() {}

  navigateToAccount() {
    this.router.navigate(['/admin-account']);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const phoneNumber = localStorage.getItem('adminPhoneNumber');
      const profileDetails = { ...this.profileForm.value, phoneNumber };

      this.userService.saveProfileDetails(profileDetails).subscribe(
        response => {
          console.log('Profile details saved:', response);
          // Optionally, navigate to another component or perform other actions upon successful save
        },
        error => {
          console.error('Error saving profile details:', error);
          // Handle error scenarios
        }
      );
    }
  }

  calculateTotalPrice() {
    const { gatepassType, numberOfAdults, numberOfChildren } = this.profileForm.value;
    let adultPrice = 0;
    let childPrice = 0;

    switch (gatepassType) {
      case 'circus':
        adultPrice = 50;
        childPrice = 30;
        break;
      case 'waterfalls':
        adultPrice = 40;
        childPrice = 20;
        break;
      case 'both':
        adultPrice = 80;
        childPrice = 60;
        break;
      default:
        break;
    }

    this.totalPrice = (numberOfAdults * adultPrice) + (numberOfChildren * childPrice);
    this.paymentRequest.transactionInfo.totalPrice = this.totalPrice.toFixed(2);
  }

  onLoadPaymentData(event: any) {
    console.log('Payment data loaded:', event);
    // Handle the payment data response here
  }
}
