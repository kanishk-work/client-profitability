import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1772826818688 implements MigrationInterface {
    name = 'InitialSchema1772826818688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_monthly_revenue" ("id" SERIAL NOT NULL, "client_id" integer NOT NULL, "month" date NOT NULL, "revenue" numeric(10,2) NOT NULL, "estimated_hours" numeric(10,2), CONSTRAINT "UQ_dae44bcd61cc46d11ca1eeb37ae" UNIQUE ("client_id", "month"), CONSTRAINT "PK_b3decab7d9a01e592ad8792a764" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_99e921caf21faa2aab020476e44" UNIQUE ("name"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "time_entries" ("id" SERIAL NOT NULL, "client_id" integer NOT NULL, "role_id" integer NOT NULL, "hours" numeric(6,2) NOT NULL, "date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b8bc5f10269ba2fe88708904aa0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "monthly_salary" numeric(10,2) NOT NULL, "productive_hours_per_month" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_monthly_revenue" ADD CONSTRAINT "FK_8579f0f73fe0b06fd1370d1777e" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_5a6ba0cc4ad8ddf8d8d7423b28c" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "time_entries" ADD CONSTRAINT "FK_5421040014ae36dc1bd2b9fff4e" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_5421040014ae36dc1bd2b9fff4e"`);
        await queryRunner.query(`ALTER TABLE "time_entries" DROP CONSTRAINT "FK_5a6ba0cc4ad8ddf8d8d7423b28c"`);
        await queryRunner.query(`ALTER TABLE "client_monthly_revenue" DROP CONSTRAINT "FK_8579f0f73fe0b06fd1370d1777e"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "time_entries"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "client_monthly_revenue"`);
    }

}
