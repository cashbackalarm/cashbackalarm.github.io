import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup;

  constructor(private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  submit(): void {
    let login: Login = { 
      email: this.form.value.email, 
      password: this.form.value.password};
    this.cashbackService.login(login).subscribe({ 
      next: () => this.router.navigateByUrl('/') 
    });
  }

}
