import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CashbackService } from 'src/app/services/cashback.service';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html'
})
export class PasswordForgottenComponent extends ParamMapSubscriberComponent {

  form: FormGroup;

  constructor(route: ActivatedRoute, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    super(route);
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    this.cashbackService.passwordForgotten(this.form.value.email).subscribe({ 
      next: () => this.setInfo('mailsent'),
      error: () => this.setError('mailsendfailed')
    });
  }

}
