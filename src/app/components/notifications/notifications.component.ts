import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationType } from 'src/app/models/notification-type';
import { Notifications } from 'src/app/models/notifications';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AbstractComponent } from '../abstract/abstract.component';
import { environment } from '../../../environments/environment';
import { SwPush } from '@angular/service-worker';
import { Subscription } from 'src/app/models/subscription';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent extends AbstractComponent {

  form: FormGroup;
  notificationTypes: NotificationType[] = ['email', 'notification'];
  subscriptions: PushSubscriptionJSON[] = [];

  constructor(cashbackService: CashbackService, formBuilder: FormBuilder,
    private swPush: SwPush) {
    super(cashbackService);
    this.form = formBuilder.group({
      cashbacks: new FormArray([new FormControl(false), new FormControl(false)]),
      participations: new FormArray([new FormControl(false), new FormControl(false)]),
      subscriptions: new FormArray([])
    });
  }

  protected override handleUser(user: User | null): void {
    super.handleUser(user);
    this.refreshNotifications();
  }

  private refreshNotifications(): void {
    this.subscriptionsFormArray.clear();
    this.subscriptions = [];
    this.cashbackService.getNotifications().subscribe({
      next: (notifications: Notifications) => {
        this.notificationTypes.forEach((notificationType: NotificationType, index: number) => {
          this.cashbacksFormArray.get('' + index)?.setValue(this.getCheckboxValue(notifications.cashbacks, notificationType));
          this.participationsFormArray.get('' + index)?.setValue(this.getCheckboxValue(notifications.participations, notificationType));
        });
        let subscriptions = notifications.subscriptions;
        if (!subscriptions) {
          return;
        }
        subscriptions.forEach((subscription: Subscription) => {
          this.subscriptionsFormArray.push(new FormControl(subscription.name, Validators.required));
          this.subscriptions.push(subscription.subscription);
        });
      }
    });
  }

  private getCheckboxValue(values: NotificationType[], value: NotificationType): boolean {
    return values != null && values.includes(value)
  }

  get cashbacksFormArray() {
    return this.form.controls['cashbacks'] as FormArray;
  }

  get participationsFormArray() {
    return this.form.controls['participations'] as FormArray;
  }

  get subscriptionsFormArray() {
    return this.form.controls['subscriptions'] as FormArray;
  }

  addSubscription(): void {
    if (environment.production) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      })
        .then((sub: PushSubscription) => {
          this.subscriptionsFormArray.push(new FormControl('', Validators.required));
          this.subscriptions.push(sub);
        })
        .catch(err => console.error("Could not subscribe to notifications", err));
    } else {
      this.subscriptionsFormArray.push(new FormControl('', Validators.required));
      this.subscriptions.push({
        endpoint: "https://fcm.googleapis.com/fcm/send/ccWcZOadtzY:APA91bFsbTfkOnxyGQAaKgUJXIY5yGZ2fGqSy2iejixuwuAg_JIWwGuq-g-2_hbioOYbZNwkKBfD2c42IcD7wimosgmd9vATtmohS01Co5KFpagO5hxxeJrR5Ts8qoi9iqaisnqPEiUR",
        expirationTime: null,
        keys: {
          auth: "XmB0uqiSGq2frgLioft4Yw",
          p256dh: "BKpFNwlKcCk1jnPPOtCZnOrkOFgB-XwlDDHJZmeaF4Ytxc9IJB-HsN9VFzflKBST7aXz3PRkjLMvg6rspjkZZLI"
        }
      });
    }
  }

  testSubscription(index: number): void {
    let sub = this.subscriptions[index];
    this.cashbackService.testSubscription(sub).subscribe();
  }

  deleteSubscription(index: number): void {
    this.subscriptionsFormArray.removeAt(index);
    delete this.subscriptions[index];
  }

  private getNotificationTypes(values: boolean[]): NotificationType[] {
    return values
      .map((checked: boolean, i: number) => checked ? this.notificationTypes[i] : null)
      .filter((value: NotificationType | null) => value !== null)
      .map((value: NotificationType | null) => value as NotificationType);
  }

  private getSubscriptions(): Subscription[] {
    return this.form.value.subscriptions
      .map((name: string, i: number) => {
        return { name: name, subscription: this.subscriptions[i] };
      });
  }

  submit(): void {
    let notifications: Notifications = {
      cashbacks: this.getNotificationTypes(this.form.value.cashbacks),
      participations: this.getNotificationTypes(this.form.value.participations),
      subscriptions: this.getSubscriptions()
    };
    this.cashbackService.updateNotifications(notifications).subscribe({
      next: () => this.refreshNotifications()
    });
  }

}
