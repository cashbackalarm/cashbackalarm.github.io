import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  showPassword = false;
  error: string | null = null;
  redirectUrl: string | null = null;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    this.route.queryParamMap
      .subscribe((paramMap: ParamMap) => {
        this.error = paramMap.get('error')
        this.redirectUrl = paramMap.get('redirect_url')
      });
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
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
      next: () => {
        this.router.navigateByUrl(this.redirectUrl ? this.redirectUrl : '/');
      }
    });
  }

}
