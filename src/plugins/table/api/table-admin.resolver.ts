import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject } from '@vendure/common/lib/shared-types';
import {
    Allow,
    Ctx,
    ID,
    ListQueryOptions,
    PaginatedList,
    RelationPaths,
    Relations,
    RequestContext,
    Transaction
} from '@vendure/core';
import { Table } from '../entities/table.entity';
import { TableService } from '../services/table.service';

// These can be replaced by generated types if you set up code generation
interface CreateTableInput {
    code: string;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}
interface UpdateTableInput {
    id: ID;
    code?: string;
    // Define the input fields here
    customFields?: CustomFieldsObject;
}

@Resolver()
export class TableAdminResolver {
    constructor(private tableService: TableService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async table(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
        @Relations(Table) relations: RelationPaths<Table>,
    ): Promise<Table | null> {
        return this.tableService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async tables(
        @Ctx() ctx: RequestContext,
        @Args() args: { options: ListQueryOptions<Table> },
        @Relations(Table) relations: RelationPaths<Table>,
    ): Promise<PaginatedList<Table>> {
        return this.tableService.findAll(ctx, args.options || undefined, relations);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async createTable(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateTableInput },
    ): Promise<Table> {
        return this.tableService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async updateTable(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateTableInput },
    ): Promise<Table> {
        return this.tableService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async deleteTable(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
        return this.tableService.delete(ctx, args.id);
    }
}
