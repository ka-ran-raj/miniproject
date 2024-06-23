import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.css']
})
export class AdminAccountComponent implements OnInit {
  tickets: any[] = [];
  phoneNumber: string | null = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.phoneNumber = localStorage.getItem('adminPhoneNumber');
    if (this.phoneNumber) {
      this.userService.getTicketsByPhoneNumber(this.phoneNumber).subscribe(
        (response) => {
          if (response.success) {
            this.tickets = response.data;
          } else {
            alert('No tickets found for this user.');
          }
        },
        (error) => {
          console.error('Error fetching tickets:', error);
        }
      );
    } else {
      alert('No phone number found in local storage.');
    }
  }
}
