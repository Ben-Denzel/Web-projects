import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isDarkMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router : Router,
    private http : HttpClient
  ){}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.isDarkMode = savedTheme === 'dark';
      }
    }
  }


  toggleDarkMode(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.isDarkMode = newTheme === 'dark';
    }
  }


  logout() {
    this.authService.logout();
  }

  task() {
    this.router.navigate(['/task']);
    if(!this.authService.getToken()){
      this.router.navigate(['/login']);
    }
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }
}
