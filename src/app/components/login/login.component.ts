import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  showPassword = false;
  info: string | null;
  error: string | null;
  redirectUrl: string | null;
  form: FormGroup;
  private token: string | null;

  constructor(private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    let url = router.parseUrl(router.url);
    this.info = url.queryParamMap.get('info');
    this.error = url.queryParamMap.get('error');
    this.redirectUrl = url.queryParamMap.get('redirect_url');
    this.token = url.queryParamMap.get('token');
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  ngOnInit(): void {
    if (this.token) {
      this.cashbackService.confirmRegistration(this.token).subscribe({
        next: () => this.info = 'emailconfirmed'
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
      next: () => {
        this.router.navigateByUrl(this.redirectUrl ? this.redirectUrl : '/');
      }
    });
  }

}
