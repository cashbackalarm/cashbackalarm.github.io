import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Cashback } from '../models/cashback';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CashbackService {

  private baseUrl: string = 'https://' + environment.backend;
  private tokenKey = 'access_token';
  private helper = new JwtHelperService();
  private _user = new BehaviorSubject<User | undefined>(undefined);
  user$ = this._user.asObservable();

  constructor(private http: HttpClient) {
  }

  getCashbacks(): Observable<Cashback[]> {
    return this.http.get<Cashback[]>(this.baseUrl + '/cashbacks');
  }

}
