import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { StrictEmailDirective } from '../strict-email.directive';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, CommonModule, StrictEmailDirective],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  email = ""
  password = ""
  name = ""
  signupError = ""

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.email || !this.password || !this.name) {
      this.signupError = 'Please fill in all fields.';
      return;
    }
    this.authService.signup(this.name, this.email, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.signupError = err;
      }
    });
  }
}
