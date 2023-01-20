import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  url: string = environment.url;
  answered: boolean = false;
  consented: boolean = false;
  cookieTypes: string[] = ['mandatory', 'statistics'];
  cookieNamesByType: Map<string, string[]> = new Map<string, string[]>();
  prefix = 'cookies';
  private tablesKey = 'tables';
  private rowsKey = 'rows';
  private statusChangeSubscription: Subscription;

  constructor(private ccService: NgcCookieConsentService, private translate: TranslateService) {
    this.handleCookie();
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      () => {
        this.handleCookie();
      });
  }

  ngOnInit(): void {
    let keys = this.cookieTypes.map((cookieType) => this.toKey(cookieType));
    this.translate
      .get(keys)
      .subscribe(translations => {
        console.log(translations)
        for (let cookieType of this.cookieTypes) {
          let data = translations[this.toKey(cookieType)];
          this.cookieNamesByType.set(cookieType, Object.keys(data));
        }
      });
  }

  private toKey(cookieType: string) { return this.prefix + '.' + this.tablesKey + '.' + cookieType + '.' + this.rowsKey; }

  private handleCookie(): void {
    this.answered = this.ccService.hasAnswered();
    this.consented = this.ccService.hasConsented();
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }

}
