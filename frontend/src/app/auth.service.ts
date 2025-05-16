import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { UserDto } from './dto/UserDto';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpUrl: String
  loggedIn = false;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    this.httpUrl = `${environment.apiUrl}/auth`
  }


  signup(name: string, email: string, password: string): Observable<any> {
    const url = `${this.httpUrl}/signup`;
    return this.http.post<any>(url, { email, password, name }, httpOptions).pipe(
      map(res => res as UserDto),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.httpUrl}/login`;
    return this.http.post<any>(url, { email, password }, httpOptions).pipe(
      tap(res => {
        this.tokenService.setToken(res.token)
        this.loggedIn = true;
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout() {
    this.tokenService.clearToken()
    this.loggedIn = false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else  if (error.error) {
      errorMessage = error.error
    } else {
      errorMessage = `Server error: ${error.status}`;
    }


    return throwError(() => new Error(errorMessage));
  }
}
