import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsTable1781420034891 implements MigrationInterface {
  name = 'UpdateProductsTable1781420034891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` CHANGE \`is_active\` \`is_active\` tinyint NOT NULL DEFAULT '0'`,
    );
  }
}
