import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';

@Component({
  template: ''
})
export abstract class AbstractComponent implements OnInit {

  me: User | null = null;

  constructor(protected cashbackService: CashbackService) {
  }

  ngOnInit(): void {
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
