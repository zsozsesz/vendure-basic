import { MigrationInterface, QueryRunner } from 'typeorm';

export class TableSchema1725173106244 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "table" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "code" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "table"`, undefined);
  }
}
