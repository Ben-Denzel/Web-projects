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
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    window.location.href = 'https://task-manager-backend-hu0f.onrender.com/api/auth/google';
    // window.location.href = 'http://localhost:5000/api/auth/google';
  }

  onLogin(){
    this.loading = true;
    this.authService.login(this.user).subscribe({
      next: (res) =>{
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Login Faild: '+ err.error)
        this.loading = false
      },
      complete: () =>{
        this.loading = false
      }
    });
  }

}
