import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1772830341493 implements MigrationInterface {
    name = 'AddIndexes1772830341493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_cmr_client_month" ON "client_monthly_revenue" ("client_id", "month") `);
        await queryRunner.query(`CREATE INDEX "idx_time_entries_client_date" ON "time_entries" ("client_id", "date") `);
        await queryRunner.query(`CREATE INDEX "idx_time_entries_date" ON "time_entries" ("date") `);
        await queryRunner.query(`CREATE INDEX "idx_time_entries_role_id" ON "time_entries" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "idx_time_entries_client_id" ON "time_entries" ("client_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_time_entries_client_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_time_entries_role_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_time_entries_date"`);
        await queryRunner.query(`DROP INDEX "public"."idx_time_entries_client_date"`);
        await queryRunner.query(`DROP INDEX "public"."idx_cmr_client_month"`);
    }

}
