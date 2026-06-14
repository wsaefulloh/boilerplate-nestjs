import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductsTable1781416267450 implements MigrationInterface {
  name = 'UpdateProductsTable1781416267450';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`,
    );
  }
}
