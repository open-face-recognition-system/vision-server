import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class UpdateSubjectTeacher1608989711726
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('subjects', 'SubjectTeacher');
    await queryRunner.dropColumn('subjects', 'teacher_id');

    await queryRunner.addColumn(
      'subjects',
      new TableColumn({
        name: 'teacher_id',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'subjects',
      new TableForeignKey({
        name: 'SubjectTeacher',
        referencedTableName: 'teachers',
        referencedColumnNames: ['id'],
        columnNames: ['teacher_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('subjects', 'SubjectTeacher');
    await queryRunner.dropColumn('subjects', 'teacher_id');

    await queryRunner.addColumn(
      'subjects',
      new TableColumn({
        name: 'teacher_id',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      'subjects',
      new TableForeignKey({
        name: 'SubjectTeacher',
        referencedTableName: 'teachers',
        referencedColumnNames: ['id'],
        columnNames: ['teacher_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }
}
