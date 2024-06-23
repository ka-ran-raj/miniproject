import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { phoneNumber, password } = this.loginForm.value;
      this.userService.loginAdmin({ phoneNumber, password }).subscribe(
        response => {
          if (response.success) {
            alert('Login successful!');
            localStorage.setItem('userPhoneNumber', phoneNumber); // Store user's phone number
            this.router.navigate(['/profile']);
          } else {
            alert('Invalid credentials. Please try again.');
          }
        },
        error => {
          console.error('Login error:', error);
          alert('An error occurred. Please try again later.');
        }
      );
    }
  }
}
