import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { Registration } from 'src/app/models/registration';
import { CashbackService } from 'src/app/services/cashback.service';
import { environment } from 'src/environments/environment';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent extends ParamMapSubscriberComponent {

  form: FormGroup;

  constructor(route: ActivatedRoute, private cashbackService: CashbackService, private swPush: SwPush, formBuilder: FormBuilder) {
    super(route);
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      confirmation: [false, [Validators.requiredTrue]],
      notifications: false
    });
  }

  get name() {
    return this.form.controls['name'];
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  get confirmation() {
    return this.form.controls['confirmation'];
  }

  submit(): void {
    try {
      if (this.form.value.notifications) {
        this.swPush.requestSubscription({
          serverPublicKey: environment.vapidPublicKey
        })
          .then((sub: PushSubscription) => {
            let registration: Registration = {
              name: this.form.value.name,
              email: this.form.value.email,
              password: this.form.value.password,
              notifications: {
                cashbacks: ['email', 'web-push'],
                participations: ['email', 'web-push'],
                subscriptions: [{ name: 'Gerät 1', subscription: sub }]
              }
            };
            this.register(registration);
          })
          .catch(err => {
            console.error("Could not subscribe to notifications", err);
            let registration: Registration = {
              name: this.form.value.name,
              email: this.form.value.email,
              password: this.form.value.password,
              notifications: {
                cashbacks: ['email'],
                participations: ['email'],
                subscriptions: []
              }
            };
            this.register(registration);
          });
      } else {
        let registration: Registration = {
          name: this.form.value.name,
          email: this.form.value.email,
          password: this.form.value.password,
          notifications: {
            cashbacks: [],
            participations: [],
            subscriptions: []
          }
        };
        this.register(registration);
      }
    } catch (ex) {
      console.error("Help me", ex);
    }
  }

  private register(registration: Registration): void {
    this.cashbackService.register(registration).subscribe({
      next: () => this.setInfo('emailconfirmationrequired'),
      error: () => this.setError('registrationfailed')
    });
  }

}
