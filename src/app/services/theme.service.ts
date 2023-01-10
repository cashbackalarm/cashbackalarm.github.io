import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _darkTheme: BehaviorSubject<boolean>;
  isDarkTheme: Observable<boolean>;

  constructor() {
    let theme = localStorage.getItem('theme')
    this._darkTheme = new BehaviorSubject<boolean>(theme == 'dark');
    this.isDarkTheme = this._darkTheme.asObservable();
  }

  setDarkTheme(isDarkTheme: boolean): void {
    this._darkTheme.next(isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }
}
