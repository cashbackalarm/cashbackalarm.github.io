import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { ParamMapSubscriberComponent } from '../param-map-subscriber/param-map-subscriber.component';

@Component({
  template: ''
})
export abstract class AuthenticatedComponent extends ParamMapSubscriberComponent implements OnInit {

  me: User | null = null;

  constructor(route: ActivatedRoute, protected cashbackService: CashbackService) {
    super(route);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.cashbackService.user$.subscribe({
      next: (user: User | null) => {
        this.handleUser(user);
      }
    });
  }

  protected handleUser(user: User | null): void {
    this.me = user;
  }

}
