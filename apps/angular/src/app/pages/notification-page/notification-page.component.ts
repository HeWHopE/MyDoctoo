import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgClass } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { INotification } from '../../data-types/notification-types';
import { Observable, tap } from 'rxjs';
import {
  selectError,
  selectLoading,
  selectNotifications,
  selectTotalCount,
} from '../../states/notification/notification.selectors';
import { Store } from '@ngrx/store';
import * as NotificationActions from '../../states/notification/notification.actions';
import { NotificationHeaderComponent } from './components/notification-header/notification-header.component';
import { NotificationBodyComponent } from './components/notification-body/notification-body.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { NotificationSkeletonComponent } from './components/notification-skeleton/notification-skeleton.component';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [
    CdkAccordionModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NgClass,
    NotificationHeaderComponent,
    NotificationBodyComponent,
    HeaderComponent,
    AsyncPipe,
    NotificationSkeletonComponent,
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.scss',
  animations: [
    trigger('accordion', [
      state(
        'collapsed',
        style({
          height: '0',
          opacity: 0,
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          display: 'block',
        })
      ),
      transition('expanded => collapsed', [animate('400ms ease-in-out')]),
      transition('collapsed => expanded', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class NotificationPageComponent implements OnInit {
  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {}

  @ViewChild('paginator') paginator!: MatPaginator;

  public loading$?: Observable<boolean>;
  public error$?: Observable<string | null | unknown>;
  public notifications?: INotification[];
  public totalCount?: number;

  public limit: number = 10;
  public paginationOptions: number[] = [10, 20, 50, 100];
  public isGridView: boolean = false;
  public filters: string[] = ['All', 'Appointment', 'Payment', 'Message'];
  public activeFilter: string = 'All';
  public icon = 'notifications_active';
  public title = 'Notifications';
  public bp1280: boolean = false;

  private notifications$?: Observable<INotification[]>;
  private totalCount$?: Observable<number>;
  private currentPage: number = 1;
  private filterType: string = 'all';

  ngOnInit() {
    this.loadNotifications();
    this.checkScreenExtension();
    this.getDataFromLocalStorage();

    this.notifications$ = this.store.select(selectNotifications);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    this.notifications$
      .pipe(
        tap(data => {
          this.notifications = data;
        })
      )
      .subscribe();
  }

  loadNotifications() {
    this.store.dispatch(
      NotificationActions.loadNotifications({
        page: this.currentPage,
        limit: this.limit,
        filter: this.filterType,
      })
    );

    this.totalCount$ = this.store.select(selectTotalCount);
    this.totalCount$.subscribe(data => {
      this.totalCount = data;
    });
  }

  onPaginateChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.loadNotifications();
  }

  onFilterChange(filterType: string) {
    this.filterType = filterType.toLowerCase();
    this.activeFilter = filterType;
    this.currentPage = 1;
    this.loadNotifications();

    if (this.totalCount && this.totalCount > 10) {
      this.paginator.firstPage();
    }
  }

  toggleView() {
    this.isGridView = !this.isGridView;
    this.setDataToLocalStorage();
  }

  setDataToLocalStorage() {
    localStorage.setItem('isGridView', JSON.stringify(this.isGridView));
  }

  getDataFromLocalStorage() {
    const notificationView = localStorage.getItem('isGridView');
    if (notificationView !== null) {
      this.isGridView = JSON.parse(notificationView);
    } else {
      this.isGridView = false;
    }
  }

  shouldShowDetails(item: INotification): boolean {
    const relevantActions = ['CONFIRMED_APPOINTMENT', 'UPCOMING_APPOINTMENT', 'COMPLETED_APPOINTMENT'];

    return relevantActions.includes(item.action);
  }

  checkScreenExtension() {
    const minWidth = '(min-width: 1280px)';

    this.breakpointObserver.observe([minWidth]).subscribe(result => {
      this.bp1280 = result.matches;
    });
  }
}
