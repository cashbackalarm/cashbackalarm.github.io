import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { Moment } from 'moment';
import { CashbackService } from './services/cashback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedComponent } from './components/authenticated/authenticated.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends AuthenticatedComponent {
  name = environment.name;
  isDarkTheme: Observable<boolean>;
  github: string = environment.github;
  private statusChangeSubscription: Subscription;
  private initializedSubscription: Subscription;
  private gtmEnabled: boolean = false;

  constructor(private router: Router,
    private overlayContainer: OverlayContainer,
    public translate: TranslateService,
    private dateAdapter: DateAdapter<Moment>,
    private themeService: ThemeService,
    private gtmService: GoogleTagManagerService,
    private ccService: NgcCookieConsentService,
    route: ActivatedRoute,
    cashbackService: CashbackService) {
    super(route, cashbackService);
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.initializedSubscription = ccService.initialized$.subscribe(
      () => this.handleCookie()
    );
    this.statusChangeSubscription = ccService.statusChange$.subscribe(
      () => this.handleCookie()
    );
    this.initLanguage();
  }

  private initLanguage(): void {
    this.translate.addLangs(['de']);
    this.translate.setDefaultLang('de');
    this.translate.use('de');
    this.dateAdapter.setLocale('de');
    this.translate
      .get(['cookie.message', 'cookie.link', 'cookie.href', 'cookie.allow', 'cookie.deny', 'cookie.policy'])
      .subscribe(data => {
        this.ccService.getConfig().content = this.ccService.getConfig().content || {};
        this.ccService.getConfig().content!.message = data['cookie.message'];
        this.ccService.getConfig().content!.link = data['cookie.link'];
        this.ccService.getConfig().content!.href = data['cookie.href'];
        this.ccService.getConfig().content!.allow = data['cookie.allow'];
        this.ccService.getConfig().content!.deny = data['cookie.deny'];
        this.ccService.getConfig().content!.policy = data['cookie.policy'];
        this.ccService.destroy();
        this.ccService.init(this.ccService.getConfig());
      });
  }

  private handleCookie(): void {
    if (this.ccService.hasConsented() && !this.gtmEnabled) {
      this.gtmService.addGtmToDom().then(
        () => {
          this.gtmEnabled = true;
        });
    }
    if (!this.ccService.hasConsented() && this.gtmEnabled) {
      window.location.reload();
    }
  }

  setDarkTheme(checked: boolean): void {
    this.themeService.setDarkTheme(checked);
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    if (checked) {
      overlayContainerClasses.add('dark-theme');
    } else {
      overlayContainerClasses.remove('dark-theme');
    }
  }

  logout(): void {
    this.cashbackService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnDestroy(): void {
    this.initializedSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
  }

}