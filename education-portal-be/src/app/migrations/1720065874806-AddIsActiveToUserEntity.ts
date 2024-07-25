import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToUserEntity1720065874806 implements MigrationInterface {
    name = 'AddIsActiveToUserEntity1720065874806'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isActive\``);
    }

}
