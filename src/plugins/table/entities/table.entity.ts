import { DeepPartial, HasCustomFields, VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

export class TableCustomFields {}

@Entity()
export class Table extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Table>) {
    super(input);
  }

  @Column()
  code: string;

  @Column((type) => TableCustomFields)
  customFields: TableCustomFields;
}
