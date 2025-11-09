import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable,  } from '@angular/core';
import {  Observable, } from 'rxjs';
import { Router } from '@angular/router';
import { AuthRequestDTO, AuthResponseDTO } from '../../models/auth.model';
import { environment } from '../../../environments/environment.prod';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private http = inject(HttpClient)
   private router = inject(Router);

  private apiUrl=`${environment.BACK_END_API_URL}/auth/`
  signup(signUpData: AuthRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}signup`, signUpData);
  }

  login(loginData: AuthRequestDTO):Observable<AuthResponseDTO>{
    return this.http.post<AuthResponseDTO>(`${this.apiUrl}login`, loginData)
  }
  getCurrentUser(): { id: string; username: string } | null {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return {
          id: decoded.id,
          username: decoded.username && typeof decoded.username === 'string' 
                      ? decoded.username 
                      : 'User'
        };
      } catch {
        return null;
      }
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('access_token');
    }
      

    logoutUser(): void {
    console.log('Interceptor: Logging out user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
