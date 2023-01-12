import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordReset } from 'src/app/models/password-reset';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {

  form: FormGroup;

  constructor(private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    let url = router.parseUrl(router.url);
    let token = url.queryParamMap.get('token');
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]],
      token: [token, [Validators.required]]
    });
  }

  submit(): void {
    let passwordReset: PasswordReset = { email: this.form.value.email, password: this.form.value.password, token: this.form.value.token };
    this.cashbackService.resetPassword(passwordReset).subscribe({
      next: () => this.router.navigateByUrl('/login')
    });
  }

}
