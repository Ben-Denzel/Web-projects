import { Component } from '@angular/core';
//import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  username ='';

   constructor(
      private http : HttpClient
    ){}

  toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // this.http.get<{ username: string }>('http://localhost:5000/api/auth/me', {
      this.http.get<{ username: string }>('https://task-manager-backend-hu0f.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: res => this.username =`Welcome :`+res.username,
        error: err => console.error('Failed to fetch user', err)
      });
    }

  }



}
