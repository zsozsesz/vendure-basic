import * as path from 'path';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { TABLE_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { Table } from './entities/table.entity';
import { TableService } from './services/table.service';
import { TableAdminResolver } from './api/table-admin.resolver';
import { adminApiExtensions } from './api/api-extensions';
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    { provide: TABLE_PLUGIN_OPTIONS, useFactory: () => TablePlugin.options },
    TableService,
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    return config;
  },
  compatibility: '^3.0.0',
  entities: [Table],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [TableAdminResolver],
  },
})
export class TablePlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<TablePlugin> {
    this.options = options;
    return TablePlugin;
  }

  static ui: AdminUiExtension = {
    id: 'table-ui',
    extensionPath: path.join(__dirname, 'ui'),
    routes: [{ route: 'table', filePath: 'routes.ts' }],
    providers: ['providers.ts'],
  };
}
