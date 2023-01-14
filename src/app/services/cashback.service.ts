import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, Observable, of, map, tap, Subject, throwError, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Cashback } from '../models/cashback';
import { Profile } from '../models/profile';
import { Registration } from '../models/registration';
import { Login } from '../models/login';
import { PasswordReset } from '../models/password-reset';
import { Notifications } from '../models/notifications';
import { Participation } from '../models/participation';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { ParticipationUpdate } from '../models/participation-update';
import { ParticipationCreation } from '../models/participation-creation';

@Injectable({
  providedIn: 'root'
})
export class CashbackService {

  private baseUrl: string = 'https://' + environment.backend;
  private tokenKey = 'access_token';
  private helper = new JwtHelperService();
  private _user: BehaviorSubject<User | null>;
  user$: Observable<User | null>;
  userKey?: string;

  constructor(private http: HttpClient, private router: Router) {
    let token = localStorage.getItem(this.tokenKey);
    let user = token ? this.helper.decodeToken<User>(token) : null;
    this._user = new BehaviorSubject<User | null>(user);
    this.user$ = this._user.asObservable();
    this.user$.subscribe({
      next: (user: User | null) => {
        if (user) {
          this.userKey = user.key;
        } else {
          this.userKey = undefined;
        }
      }
    });
  }

  private handleToken(token: string | null): void {
    let user: User | null = null;
    if (token != null) {
      user = this.helper.decodeToken<User>(token);
    }
    if (token != null && user) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
    this._user.next(user);
  }

  getCashbacks(): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(this.baseUrl + '/cashbacks').pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  register(registration: Registration): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/users', registration).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  login(login: Login): Observable<void> {
    return this.http.post(this.baseUrl + '/login', login, { observe: 'response', responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleToken(null);
          if (error.status === 401) {
            this.router.navigateByUrl('/login?error=wrongcredentials');
            return of();
          }
          if (error.status === 403) {
            this.router.navigateByUrl('/login?error=locked');
            return of();
          }
          return throwError(() => new Error('' + error.status));
        }),
        map((response: HttpResponse<string>) => this.handleToken(response.body)
        )
      );
  }

  getProfile(): Observable<Profile> {
    if (!this.userKey) {
      return of();
    }
    return this.http.get<Profile>(this.baseUrl + '/users/' + this.userKey + '/profile').pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getNotifications(): Observable<Notifications> {
    if (!this.userKey) {
      return of();
    }
    return this.http.get<Notifications>(this.baseUrl + '/users/' + this.userKey + '/notifications').pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getParticipations(): Observable<Participation[]> {
    if (!this.userKey) {
      return of([]);
    }
    return this.http.get<Participation[]>(this.baseUrl + '/users/' + this.userKey + '/participations').pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  passwordForgotten(email: string): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/tokens', { email: email }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  resetPassword(passwordReset: PasswordReset): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/reset-password', passwordReset).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateName(name: string): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put(this.baseUrl + '/users/' + this.userKey + '/name', name, { observe: 'response', responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => this.handleToken(response.body))
    );
  }

  updateNotifications(notifications: Notifications): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.put<void>(this.baseUrl + '/users/' + this.userKey + '/notifications', notifications).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  testSubscription(sub: PushSubscriptionJSON): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/subscriptions', sub).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  getParticipation(participationKey: string): Observable<Participation> {
    return this.http.get<Participation>(this.baseUrl + '/participations/' + participationKey).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  addParticipation(cashbackKey: string, amount: number, reminder: number): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    let participation: ParticipationCreation = { cashback: cashbackKey, amount: amount, reminder: reminder };
    return this.http.post<void>(this.baseUrl + '/users/' + this.userKey + '/participations', participation).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  updateParticipation(participationKey: string, amount: number, reminder: number): Observable<void> {
    let participation: ParticipationUpdate = { amount: amount, reminder: reminder };
    return this.http.put<void>(this.baseUrl + '/participations/' + participationKey, participation).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  deleteParticipation(participationKey: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/participations/' + participationKey).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/logout', null).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      tap(_ => this.handleToken(null))
    );
  }

  deleteUser(): Observable<void> {
    if (!this.userKey) {
      return of();
    }
    return this.http.delete<void>(this.baseUrl + '/users/' + this.userKey).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.handleToken(null);
      this.router.navigateByUrl('/login?tokenexpired');
      return of();
    }
    return throwError(() => new Error('' + error.status));
  }

}
