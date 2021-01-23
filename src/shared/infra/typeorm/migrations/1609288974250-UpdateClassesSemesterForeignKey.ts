import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class UpdateClassesSemesterForeignKey1609288974250
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('classes', 'ClassSemester');
    await queryRunner.createForeignKey(
      'classes',
      new TableForeignKey({
        name: 'ClassSemester',
        referencedTableName: 'semesters',
        referencedColumnNames: ['id'],
        columnNames: ['semester_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('classes', 'ClassSemester');
    await queryRunner.createForeignKey(
      'classes',
      new TableForeignKey({
        name: 'ClassSemester',
        referencedTableName: 'subjects',
        referencedColumnNames: ['id'],
        columnNames: ['semester_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
