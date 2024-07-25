import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivationUserLogEntitt1720410591902 implements MigrationInterface {
    name = 'AddActivationUserLogEntitt1720410591902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activation_user_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`isActive\` tinyint NOT NULL, \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activation_user_log\` ADD CONSTRAINT \`FK_904d28bb58611de3556ebb25980\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`activation_user_log\` DROP FOREIGN KEY \`FK_904d28bb58611de3556ebb25980\``);
        await queryRunner.query(`DROP TABLE \`activation_user_log\``);
    }

}
