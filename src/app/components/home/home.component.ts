import { Component, OnInit } from '@angular/core';
import { Cashback } from 'src/app/models/cashback';
import { CashbackService } from 'src/app/services/cashback.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cdn = environment.cdn;
  cashbacks: Cashback[] = [];

  constructor(private cashbackService: CashbackService) {
  }

  ngOnInit(): void {
    this.refreshCashbacks();
  }

  private refreshCashbacks(): void {
    this.cashbackService.getCashbacks().subscribe(
      {
        next: (cashbacks: Cashback[]) => this.cashbacks = cashbacks
      }
    );
  }

}
