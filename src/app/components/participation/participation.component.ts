import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Cashback } from 'src/app/models/cashback';
import { Participation } from 'src/app/models/participation';
import { ParticipationCreation } from 'src/app/models/participation-creation';
import { ParticipationUpdate } from 'src/app/models/participation-update';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  selector: 'app-participation',
  templateUrl: './participation.component.html'
})
export class ParticipationComponent extends AbstractComponent {

  form: FormGroup;
  cashbacks: Cashback[] = [];
  participationKey: string;
  private cashbackByKey = new Map<string, Cashback>();

  constructor(private router: Router, cashbackService: CashbackService, formBuilder: FormBuilder) {
    super(cashbackService);
    this.participationKey = router.url.split('/')[2];
    cashbackService.getCashbacks().subscribe({
      next: (cashbacks: Cashback[]) => {
        this.cashbacks = cashbacks;
        cashbacks.forEach((value: Cashback) => this.cashbackByKey.set(value.key, value));
      }
    });
    this.form = formBuilder.group({
      cashback: [null, [Validators.required]],
      amount: [0, [Validators.min(0.01)]],
      reminder: null,
      completed: false
    });
  }

  protected override handleUser(user: User | null): void {
    super.handleUser(user);
    this.refreshParticipation();
  }

  private refreshParticipation(): void {
    if (this.participationKey == 'new') {
      return;
    }
    this.cashbackService.getParticipation(this.participationKey).subscribe({
      next: (participation: Participation) => {
        this.form.patchValue({
          cashback: participation.cashback.key,
          amount: participation.amount,
          reminder: participation.reminder ? moment.unix(participation.reminder) : null,
          completed: participation.completed
        });
      }
    });
  }

  getCashback(): Cashback | undefined {
    let key = this.form.controls['cashback'].value
    if (!key) {
      return undefined;
    }
    return this.cashbackByKey.get(key);
  }

  private getReminder(): number | undefined {
    let reminder = this.form.value.reminder;
    if (reminder == null) {
      return undefined;
    }
    return reminder.unix();
  }

  submit(): void {
    if (this.participationKey == 'new') {
      let participation: ParticipationCreation = {
        cashback: this.form.value.cashback,
        amount: this.form.value.amount,
        reminder: this.getReminder(),
        completed: this.form.value.completed
      };
      this.cashbackService.addParticipation(participation).subscribe({
        next: () => this.router.navigateByUrl('/participations')
      });
    } else {
      let participation: ParticipationUpdate = {
        amount: this.form.value.amount,
        reminder: this.getReminder(),
        completed: this.form.value.completed
      };
      this.cashbackService.updateParticipation(this.participationKey, participation).subscribe({
        next: () => this.router.navigateByUrl('/participations')
      });
    }
  }

}
