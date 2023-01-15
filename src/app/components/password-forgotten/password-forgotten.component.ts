import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-password-forgotten',
  templateUrl: './password-forgotten.component.html'
})
export class PasswordForgottenComponent {

  form: FormGroup;

  constructor(private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit(): void {
    this.cashbackService.passwordForgotten(this.form.value.email).subscribe({ 
      next: () => this.router.navigateByUrl('/login?info=passwordresetmailsent') 
    });
  }

}
