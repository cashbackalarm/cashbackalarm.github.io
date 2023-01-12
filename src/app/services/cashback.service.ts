import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, map, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Cashback } from '../models/cashback';
import { User } from '../models/user';
import { Registration } from '../models/registration';
import { Login } from '../models/login';
import { PasswordReset } from '../models/password-reset';
import { Notifications } from '../models/notifications';

@Injectable({
  providedIn: 'root'
})
export class CashbackService {

  private baseUrl: string = 'https://' + environment.backend;
  private tokenKey = 'access_token';
  private helper = new JwtHelperService();
  private userKey?: string;
  private _user: BehaviorSubject<User | undefined>;
  user$: Observable<User | undefined>;

  constructor(private http: HttpClient) {
    let token = localStorage.getItem(this.tokenKey)
    if (token) {
      const user = this.helper.decodeToken(token);
      this._user = new BehaviorSubject<User | undefined>(user);
      this.userKey = user.key;
    } else {
      this._user = new BehaviorSubject<User | undefined>(undefined);
      this.userKey = undefined;
    }
    this.user$ = this._user.asObservable();
  }

  getCashbacks(): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(this.baseUrl + '/cashbacks');
  }

  register(registration: Registration): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/users', registration);
  }

  handleToken(token: string | null) {
    if (token == null) {
      localStorage.removeItem(this.tokenKey);
      this._user.next(undefined);
      this.userKey = undefined;
    } else {
      const user = this.helper.decodeToken(token);
      localStorage.setItem(this.tokenKey, token);
      this._user.next(user);
      this.userKey = user.key;
    }
  }

  login(login: Login): Observable<void> {
    return this.http.post(this.baseUrl + '/login', login, { observe: 'response', responseType: 'text' })
      .pipe(
        catchError(() => of()),
        map(response => {
          this.handleToken(response.body);
        }));
  }

  passwordForgotten(email: string): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/tokens', { email: email });
  }

  resetPassword(passwordReset: PasswordReset): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/reset-password', passwordReset);
  }

  updateName(name: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put(this.baseUrl + '/users/' + this.userKey + '/name', name, { observe: 'response', responseType: 'text' }).pipe(
      catchError(() => of()),
      map(response => {
        this.handleToken(response.body);
      })
    );
  }

  updateNotifications(notifications: Notifications): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/users/' + this.userKey + '/notifications', notifications);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/logout', null).pipe(tap(_ => {
      localStorage.removeItem(this.tokenKey);
      this._user.next(undefined);
    }));
  }

  deleteUser(): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/users/' + this.userKey);
  }

}
