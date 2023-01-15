import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PasswordReset } from 'src/app/models/password-reset';
import { CashbackService } from 'src/app/services/cashback.service';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent extends ParamMapSubscriberComponent {

  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    super(route);
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      token: ['', [Validators.required]]
    });
  }

  protected override handleParamMap(paramMap: ParamMap): void {
    super.handleParamMap(paramMap);
    let token = paramMap.get('token');
    if (token) {
      this.form.patchValue({ token: token });
    }
  }

  submit(): void {
    let passwordReset: PasswordReset = { email: this.form.value.email, password: this.form.value.password, token: this.form.value.token };
    this.cashbackService.resetPassword(passwordReset).subscribe({
      next: () => this.router.navigateByUrl('/login?info=passwordresetted'),
      error: () => this.router.navigateByUrl('/password-reset?error=passwordresetfailed')
    });
  }

}
