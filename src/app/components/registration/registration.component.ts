import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Registration } from 'src/app/models/registration';
import { CashbackService } from 'src/app/services/cashback.service';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent extends ParamMapSubscriberComponent {

  form: FormGroup;

  constructor(route: ActivatedRoute, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    super(route);
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
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

  submit(): void {
    let registration: Registration = {
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.cashbackService.register(registration).subscribe({
      next: () => this.setInfo('emailconfirmationrequired'),
      error: () => this.setError('registrationfailed')
    });
  }

}