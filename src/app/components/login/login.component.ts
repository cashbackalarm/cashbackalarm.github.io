import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { CashbackService } from 'src/app/services/cashback.service';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends ParamMapSubscriberComponent {

  showPassword = false;
  redirectUrl: string | null = null;
  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    super(route);
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  protected override handleParamMap(paramMap: ParamMap): void {
    super.handleParamMap(paramMap);
    this.redirectUrl = paramMap.get('redirect_url');
    let token = paramMap.get('token');
    if (token) {
      this.cashbackService.confirmRegistration(token).subscribe({
        next: () => this.router.navigateByUrl('/login?info=emailconfirmed'),
        error: () => this.router.navigateByUrl('/login?error=emailconfirmationfailed')
      });
    }
  }

  get email() {
    return this.form.controls['email'];
  }

  get password() {
    return this.form.controls['password'];
  }

  submit(): void {
    let login: Login = {
      email: this.form.value.email,
      password: this.form.value.password
    };
    this.cashbackService.login(login).subscribe({
      next: () => this.router.navigateByUrl(this.redirectUrl ? this.redirectUrl : '/'),
      error: () => this.router.navigateByUrl('/login?error=unknown')
    });
  }

}
