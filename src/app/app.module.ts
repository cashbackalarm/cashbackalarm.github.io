import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordForgottenComponent } from './components/password-forgotten/password-forgotten.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ParticipationComponent } from './components/participation/participation.component';
import { ParticipationsComponent } from './components/participations/participations.component';
import { HourGlassPipe } from './hour-glass-pipe';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { JwtModule } from "@auth0/angular-jwt";

import { LOCALE_ID } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';

import { environment } from '../environments/environment';
import { NgcCookieConsentConfig, NgcCookieConsentModule } from 'ngx-cookieconsent';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

const cookieConfig: NgcCookieConsentConfig = {
  animateRevokable: false,
  cookie: {
    domain: environment.frontend,
    secure: true
  },
  layout: 'basic',
  law: {
    countryCode: 'DE',
    regionalLaw: false
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#ff5722'
    }
  },
  revokable: true,
  revokeBtn: '<div class="cc-revoke {{classes}}"><img src="assets/cookie_white.svg" height="24px" width="24px" role="button" onclick="this.parentNode.click()"/></div>',
  theme: 'block',
  type: 'opt-in'
};

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    LoginComponent,
    PasswordForgottenComponent,
    PasswordResetComponent,
    ProfileComponent,
    ParticipationsComponent,
    ParticipationComponent,
    NotificationsComponent,
    HourGlassPipe
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'de',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatToolbarModule,
    MatTooltipModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.backend],
        skipWhenExpired: true
      },
    }),
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [{ provide: DateAdapter, useClass: MomentDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    MatDatepickerModule,
  { provide: 'googleTagManagerId', useValue: environment.googleTagManagerId },
  { provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
