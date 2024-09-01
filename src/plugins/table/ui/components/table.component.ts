import {
  SharedModule,
  NotificationService,
  TypedBaseListComponent,
} from '@vendure/admin-ui/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GetTableListDocument } from '../gql/graphql';
@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent extends TypedBaseListComponent<
  typeof GetTableListDocument,
  'tables'
> {
  // Here we set up the filters that will be available
  // to use in the data table
  readonly filters = this.createFilterCollection()
    .addIdFilter()
    .addDateFilters()
    .addFilter({
      name: 'code',
      type: { kind: 'text' },
      label: 'Code',
      filterField: 'code',
    })
    .connectToRoute(this.route);

  // Here we set up the sorting options that will be available
  // to use in the data table
  readonly sorts = this.createSortCollection()
    .defaultSort('createdAt', 'DESC')
    .addSort({ name: 'createdAt' })
    .addSort({ name: 'updatedAt' })
    .addSort({ name: 'code' })
    .addSort({ name: 'id' })

    .connectToRoute(this.route);

  constructor(private notificationService: NotificationService) {
    super();
    super.configure({
      document: GetTableListDocument,
      getItems: (data) => data.tables,
      setVariables: (skip, take) => ({
        options: {
          skip,
          take,
          filter: {
            code: {
              contains: this.searchTermControl.value,
            },
            ...this.filters.createFilterInput(),
          },
          sort: this.sorts.createSortInput(),
        },
      }),
      refreshListOnChanges: [
        this.filters.valueChanges,
        this.sorts.valueChanges,
      ],
    });
  }
  tables = 'Hello!';

  showNotification() {
    this.notificationService.success('Hello!');
  }

  showAlert() {
    this.notificationService.error('Hello!');
  }
}
