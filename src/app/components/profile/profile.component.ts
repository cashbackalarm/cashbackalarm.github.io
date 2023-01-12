import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends AbstractComponent {

  edit?: string;
  form: FormGroup;

  constructor(cashbackService: CashbackService, private formBuilder: FormBuilder, private router: Router) {
    super(cashbackService);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      confirmation: [false, [Validators.requiredTrue]]
    });
  }

  protected override handleUser(user?: User): void {
    super.handleUser(user);
    if (user) {
      this.form.patchValue({
        name: user.name
      });
    } else {
      this.form.patchValue({
        name: ''
      });
    }
  }

  get name() { return this.form.get('name')!; }
  get confirmation() { return this.form.get('confirmation')!; }

  editField(field: keyof User): void {
    this.edit = field
  }

  cancelEdit(field: keyof User): void {
    if (this.me) {
      this.form.get(field)?.setValue(this.me[field] as string);
    }
    this.edit = undefined;
  }

  updateName(): void {
    this.cashbackService.updateName(this.form.value.name).subscribe();
    this.edit = undefined;
  }

  deleteUser(): void {
    this.cashbackService.deleteUser().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      }
    });
  }

}
