import { registerRouteComponent } from '@vendure/admin-ui/core';
import { TableComponent } from './components/table.component';

export default [
  registerRouteComponent({
    component: TableComponent,
    path: '',
    title: 'Tables Page',
    breadcrumb: 'Tables',
  }),
];
