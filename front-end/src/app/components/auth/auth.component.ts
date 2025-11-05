import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  mode: 'login' | 'signup' = 'login';
  form = {
    username: '',
    phoneNumber: '',
    password: '',
  };


  private _authService = inject(AuthService) 
  private _router = inject(Router)
  private _toastr = inject(ToastrService)

  ngOnInit() {
    const currentPath = this._router.url;
    this.mode = currentPath.includes('signup') ? 'signup' : 'login';
  }

   toggleMode() {
    // Toggle mode and navigate
    if (this.mode === 'login') {
      this.mode = 'signup';
      this._router.navigate(['/signup']);
    } else {
      this.mode = 'login';
      this._router.navigate(['/login']);
    }
   
    this.form = {
      username: '',
      phoneNumber: '',
      password: '',
    };
  }

  onSubmit(authForm: NgForm) {
     if (authForm.invalid) {
      this._toastr.warning('Please fill all fields correctly');
      // Mark all fields as touched to show errors
      Object.keys(authForm.controls).forEach(key => {
        authForm.controls[key].markAsTouched();
      });
      return;
    }
    if (this.mode === 'login') {
      this._authService.login(this.form).subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.access_token!);
          this._toastr.success('Login successful');
          this._router.navigate(['/blogs']);
        },
        error: (err) => this._toastr.error('Login failed'),
      });
    } else {
      this._authService.signup(this.form).subscribe({
        next: () => {
          this._toastr.success('Signup successful, please login')
          console.log("signup done");
           this.mode = 'login';
          this._router.navigate(['/login']);
        },
        error: () => this._toastr.error('Signup failed'),
      });
    }
  }
}
