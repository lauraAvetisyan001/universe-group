import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginReq, LoginRes, RegisterRequest, User } from '../interfaces/auth';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public url: string = environment.URL_SERVER;

  private role: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  public register(registerData: RegisterRequest): Observable<User> {
    const url = this.url + '/user/register';
    return this.http.post<User>(url, registerData);
  }

  public login(loginData: LoginReq): Observable<LoginRes> {
    const loginUrl = `${this.url}/auth/login`;

    return this.http
      .post<LoginRes>(loginUrl, loginData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.status === 0) {
      errorMessage = 'Network error';
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.status === 500) {
      errorMessage = 'Server error: Please try again later';
    }

    return throwError(() => errorMessage);
  }

  public checkUser(): Observable<User> {
    const url = this.url + '/user';
    return this.http.get<User>(url);
  }

  public setUserRole(role: string): void {
    this.role = role;
  }

  public getUserRole(): string | null {
    if (this.role) {
      return this.role;
    }
    return null;
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}