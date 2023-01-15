import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Participation } from 'src/app/models/participation';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { AbstractComponent } from '../abstract/abstract.component';

@Component({
  selector: 'app-participations',
  templateUrl: './participations.component.html'
})
export class ParticipationsComponent extends AbstractComponent implements AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['cashback', 'amount', 'reminder', 'completed', 'actions'];
  dataSource = new MatTableDataSource<Participation>();

  readonly moment = moment;

  constructor(cashbackService: CashbackService) {
    super(cashbackService);
  }

  protected override handleUser(user: User | null): void {
    super.handleUser(user);
    this.refreshParticipations();
  }

  private refreshParticipations(): void {
    this.cashbackService.getParticipations().subscribe({
      next: (participations: Participation[]) => {
        this.dataSource.data = participations;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.refreshParticipations();
  }

  completeParticipation(participationKey: string): void {
    this.cashbackService.completeParticipation(participationKey).subscribe({
      next: () => this.refreshParticipations()
    });
  }

  deleteParticipation(participationKey: string): void {
    this.cashbackService.deleteParticipation(participationKey).subscribe({
      next: () => this.refreshParticipations()
    });
  }

}
