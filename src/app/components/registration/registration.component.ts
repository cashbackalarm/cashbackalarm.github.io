import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from 'src/app/models/registration';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {

  form: FormGroup;

  constructor(private router: Router, private cashbackService: CashbackService, formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12)]]
    });
  }

  submit(): void {
    let registration: Registration = { 
      name: this.form.value.name, 
      email: this.form.value.email, 
      password: this.form.value.password};
    this.cashbackService.register(registration).subscribe({ 
      next: () => this.router.navigateByUrl('/login') 
    });
  }

}
