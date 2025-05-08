import { Component } from '@angular/core';
import { AuthService } from '../../services/Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  user = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(){
    this.authService.login(this.user).subscribe({
      next: (res) =>{
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert('Login Faild: '+ err.error)
    });
  }

}
