import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationType } from 'src/app/models/notification-type';
import { Notifications } from 'src/app/models/notifications';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AbstractComponent } from '../abstract/abstract.component';
import { environment } from '../../../environments/environment';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent extends AbstractComponent {

  form: FormGroup;
  notificationTypes: NotificationType[] = ['email', 'notification'];

  constructor(cashbackService: CashbackService, formBuilder: FormBuilder,
    private swPush: SwPush) {
    super(cashbackService);
    this.form = formBuilder.group({
      cashbacks: new FormArray([]),
      participations: new FormArray([])
    });
  }

  protected override handleUser(user?: User): void {
    super.handleUser(user);
    if (user) {
      this.notificationTypes.forEach((notificationType: NotificationType) => {
        this.cashbacksFormArray.push(new FormControl(this.getControlValue(user.notifications.cashbacks, notificationType)))
        this.participationsFormArray.push(new FormControl(this.getControlValue(user.notifications.participations, notificationType)))
      });
    } else {
      this.cashbacksFormArray.clear();
      this.participationsFormArray.clear();
    }
  }

  private getControlValue(values: NotificationType[], value: NotificationType): boolean {
    return values != null && values.includes(value)
  }

  get cashbacksFormArray() {
    return this.form.controls['cashbacks'] as FormArray;
  }

  get participationsFormArray() {
    return this.form.controls['participations'] as FormArray;
  }

  private getNotificationTypes(values: boolean[]): NotificationType[] {
    return values
      .map((checked: boolean, i: number) => checked ? this.notificationTypes[i] : null)
      .filter((value: NotificationType | null) => value !== null)
      .map((value: NotificationType | null) => value as NotificationType);
  }

  submit(): void {
    let notifications: Notifications = {
      cashbacks: this.getNotificationTypes(this.form.value.cashbacks),
      participations: this.getNotificationTypes(this.form.value.participations)
    };
    if (notifications.cashbacks.includes('notification') || notifications.participations.includes('notification')) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      }).then((sub: PushSubscription) => {
        console.log(sub)
        notifications.sub = sub;
        this.cashbackService.updateNotifications(notifications).subscribe();
      })
        .catch(err => console.error("Could not subscribe to notifications", err));
    }
    this.cashbackService.updateNotifications(notifications).subscribe();
  }

}
