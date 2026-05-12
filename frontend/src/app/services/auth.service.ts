import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'neptun_token';
  private userKey = 'neptun_user';

  private bejelentkezve$ = new BehaviorSubject<boolean>(this.vanToken());

  constructor(private http: HttpClient) {}

  get bejelentkezve(): Observable<boolean> {
    return this.bejelentkezve$.asObservable();
  }

  get bejelentkezveErtek(): boolean {
    return this.bejelentkezve$.value;
  }

  get felhasznalonev(): string | null {
    return localStorage.getItem(this.userKey);
  }

  register(adatok: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, adatok);
  }

  login(adatok: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, adatok).pipe(
      tap((valasz) => {
        localStorage.setItem(this.tokenKey, valasz.token);
        localStorage.setItem(this.userKey, valasz.felhasznalonev);
        this.bejelentkezve$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.bejelentkezve$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private vanToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
