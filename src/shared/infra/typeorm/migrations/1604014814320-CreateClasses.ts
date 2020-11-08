import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClasses1604014814320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'start_hour',
            type: 'timestamp',
          },
          {
            name: 'end_hour',
            type: 'timestamp',
          },
          {
            name: 'date',
            type: 'timestamp',
          },
          {
            name: 'subject_id',
            type: 'int',
          },
          {
            name: 'semester_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'ClassSubject',
            referencedTableName: 'subjects',
            referencedColumnNames: ['id'],
            columnNames: ['subject_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ClassSemester',
            referencedTableName: 'subjects',
            referencedColumnNames: ['id'],
            columnNames: ['semester_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('classes');
  }
}
