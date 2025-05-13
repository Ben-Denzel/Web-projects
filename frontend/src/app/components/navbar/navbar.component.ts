import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router : Router
  ){}

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
