import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  { path: 'profile', component: ProfileComponent },
  { path: 'participations', component: ParticipationsComponent },
  { path: 'participation', component: ParticipationComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
