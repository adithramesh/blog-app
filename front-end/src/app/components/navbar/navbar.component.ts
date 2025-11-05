import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  username: string = 'User';
  
  private _authService = inject(AuthService);
  private _router = inject(Router);

  ngOnInit() {
    const user = this._authService.getCurrentUser();
    if (user) {
      this.username = user.username;
    }
  }

  logout() {
    this._authService.logoutUser();
  }
}