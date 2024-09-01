import { Inject, Injectable } from '@nestjs/common';
import {
  DeletionResponse,
  DeletionResult,
} from '@vendure/common/lib/generated-types';
import {
  CustomFieldsObject,
  ID,
  PaginatedList,
} from '@vendure/common/lib/shared-types';
import {
  CustomFieldRelationService,
  ListQueryBuilder,
  ListQueryOptions,
  RelationPaths,
  RequestContext,
  TransactionalConnection,
  assertFound,
  patchEntity,
} from '@vendure/core';
import { TABLE_PLUGIN_OPTIONS } from '../constants';
import { Table } from '../entities/table.entity';
import { PluginInitOptions } from '../types';
import { CreateTableInput } from '../gql/generated';

interface UpdateTableInput {
  id: ID;
  code?: string;
  // Define the input fields here
  customFields?: CustomFieldsObject;
}

@Injectable()
export class TableService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private customFieldRelationService: CustomFieldRelationService,
    @Inject(TABLE_PLUGIN_OPTIONS) private options: PluginInitOptions
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Table>,
    relations?: RelationPaths<Table>
  ): Promise<PaginatedList<Table>> {
    return this.listQueryBuilder
      .build(Table, options, {
        relations,
        ctx,
      })
      .getManyAndCount()
      .then(([items, totalItems]) => {
        return {
          items,
          totalItems,
        };
      });
  }

  async findOne(
    ctx: RequestContext,
    id: ID,
    relations?: RelationPaths<Table>
  ): Promise<Table | null> {
    return this.connection.getRepository(ctx, Table).findOne({
      where: { id },
      relations,
    });
  }

  async create(ctx: RequestContext, input: CreateTableInput): Promise<Table> {
    const newEntity = await this.connection
      .getRepository(ctx, Table)
      .save({ ...input });

    await this.customFieldRelationService.updateRelations(
      ctx,
      Table,
      input,
      newEntity
    );

    return assertFound(this.findOne(ctx, newEntity.id));
  }

  async update(ctx: RequestContext, input: UpdateTableInput): Promise<Table> {
    const entity = await this.connection.getEntityOrThrow(ctx, Table, input.id);
    const updatedEntity = patchEntity(entity, input);
    await this.connection
      .getRepository(ctx, Table)
      .save(updatedEntity, { reload: false });
    await this.customFieldRelationService.updateRelations(
      ctx,
      Table,
      { ...input },
      updatedEntity
    );
    return assertFound(this.findOne(ctx, updatedEntity.id));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const entity = await this.connection.getEntityOrThrow(ctx, Table, id);
    try {
      await this.connection.getRepository(ctx, Table).remove(entity);
      return {
        result: DeletionResult.DELETED,
      };
    } catch (e: any) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e.toString(),
      };
    }
  }
}
