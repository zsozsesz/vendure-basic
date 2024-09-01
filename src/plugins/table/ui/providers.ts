import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
  addNavMenuSection(
    {
      id: 'tables',
      label: 'Tables',
      items: [
        {
          id: 'table',
          label: 'Table',
          routerLink: ['/extensions/table'],
          // Icon can be any of https://core.clarity.design/foundation/icons/shapes/
          icon: 'cursor-hand-open',
        },
      ],
    },
    // Add this section before the "sales" section
    'sales'
  ),
];
