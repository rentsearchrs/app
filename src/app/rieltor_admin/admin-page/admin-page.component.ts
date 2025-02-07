import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent {
  username: string = '';
  password: string = '';
  name: string = ''; // For creating a team leader
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    this.login();
  }

  private login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }
  
    this.isLoading = true;
    const payload = new URLSearchParams();
    payload.append('username', this.username);
    payload.append('password', this.password);
  
    this.http.post<any>('https://lviv-pject.vercel.app//login', payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).subscribe(
      (response) => {
        this.isLoading = false;
        this.authService.setAuthData(response.id, response.access_token);
  
        // Redirect based on user type
        if (response.type === 'team_leader') {
          this.router.navigate(['/teamlead']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    );
  }
}
