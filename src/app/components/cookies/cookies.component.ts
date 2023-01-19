import { Component } from '@angular/core';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent {

  url: string = environment.url;
  email: string = environment.email;
  name: string = environment.name;
  answered: boolean = false;
  consented: boolean = false;
  private statusChangeSubscription: Subscription;

  constructor(private ccService: NgcCookieConsentService) {
    this.handleCookie();
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      () => {
        this.handleCookie();
      });
  }

  private handleCookie(): void {
    this.answered = this.ccService.hasAnswered();
    this.consented = this.ccService.hasConsented();
  }

  ngOnDestroy() {
    this.statusChangeSubscription.unsubscribe();
  }

}
