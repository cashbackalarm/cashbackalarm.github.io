import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Participation } from 'src/app/models/participation';
import { User } from 'src/app/models/user';
import { CashbackService } from 'src/app/services/cashback.service';
import { environment } from 'src/environments/environment';
import { AuthenticatedComponent } from '../authenticated/authenticated.component';

@Component({
  selector: 'app-participations',
  templateUrl: './participations.component.html'
})
export class ParticipationsComponent extends AuthenticatedComponent implements AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['cashback', 'amount', 'reminder', 'completed', 'actions'];
  dataSource = new MatTableDataSource<Participation>();

  cdn = environment.cdn;
  readonly moment = moment;

  constructor(route: ActivatedRoute, cashbackService: CashbackService) {
    super(route, cashbackService);
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
      next: () => { this.setInfo(null); this.refreshParticipations() },
      error: () => this.setError('completionfailed')
    });
  }

  deleteParticipation(participationKey: string): void {
    this.cashbackService.deleteParticipation(participationKey).subscribe({
      next: () => { this.setInfo(null); this.refreshParticipations() },
      error: () => this.setError('deletionfailed')
    });
  }

}
