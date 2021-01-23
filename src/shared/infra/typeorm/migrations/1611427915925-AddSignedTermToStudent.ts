import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSignedTermToStudent1611427915925
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'students',
      new TableColumn({
        name: 'signed_term',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('students', 'signed_term');
  }
}
