import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from 'src/app/models/profile';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AuthenticatedComponent } from '../authenticated/authenticated.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent extends AuthenticatedComponent {

  profile?: Profile;
  edit?: string;
  form: FormGroup;

  constructor(route: ActivatedRoute, cashbackService: CashbackService, private formBuilder: FormBuilder, private router: Router) {
    super(route, cashbackService);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      confirmation: [false, [Validators.requiredTrue]]
    });
  }

  protected override handleUser(user: User | null): void {
    super.handleUser(user);
    if (user) {
      this.form.patchValue({
        name: user.name
      });
      this.cashbackService.getProfile().subscribe({
        next: (profile: Profile) => {
          this.profile = profile;
        }
      });
    } else {
      this.form.patchValue({
        name: ''
      });
      this.profile = undefined;
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
    this.cashbackService.updateName(this.form.value.name).subscribe({
      next: () => this.setInfo('updated'),
      error: () => this.setError('updatefailed')
    });
    this.edit = undefined;
  }

  deleteUser(): void {
    this.cashbackService.deleteUser().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => this.setError('deletionfailed')
    });
  }

}
