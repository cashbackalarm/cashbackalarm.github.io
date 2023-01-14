import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ParticipationComponent } from './components/participation/participation.component';
import { ParticipationsComponent } from './components/participations/participations.component';
import { PasswordForgottenComponent } from './components/password-forgotten/password-forgotten.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'password-forgotten', component: PasswordForgottenComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'participations',
    component: ParticipationsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'participations/:participationKey',
    component: ParticipationComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
